import React, {Component} from 'react';
import axios from 'axios';
import SEOContext from './SEOContext'
import DnD from './DnD';

const { Provider } = SEOContext

export default class SEO extends Component {
    state = {
        query: {
            keywords: '',
            select: "BO:es:Bolivia:Espanol (Latinoamerica):67" // TODO: check that this value shows in TypeAhead 
        },
        filter: {
            minVolume: 0,
            maxVolume: 1000000,
            minAdwords: 0,
            maxAdwords: 100,
            minCPC: 0,
            maxCPC: 1000,
            filterKeys: '',
            eraseKeys: ''
        },
        serpData: [
            { key: '-', search_volume: 0, cpc: 0, competition: 0, id: 0, checked: false }
        ],
        rankData: [
            {
                pos: 0,
                title: '-',
                pda: '',
                shares: '',
                url: '',
            }
        ],
        article: {
            title: '',
            meta: '',
            text: '',
            textHtml: ''
        },
        showTables: false
    };

    render() {
        return (
            <Provider
                value={{
                    state: this.state,
                    actions: {
                        setPair: this.setPair
                    }
                }}
            >
                <DnD serpData={this.state.serpData}>
                    {this.props.children}
                </DnD>
            </Provider>
        )
    }

    setPair = (key, value = { keywords: '' }) => {
        if (key === 'query') {
            this.serpAPI(value);
            // this.rankedAPI(value);
        }
        this.setState({ [key]: value })
    }

    serpAPI = async (data = { keywords: '', select: '' }) => {
        this.rankedAPI(data);
        await axios({ // TODO: move axios calls to services/, also create new api
            method: 'post',
            url: `http://backend.borjamediavilla.com/api/v1/serp/serp`,
            data,
            crossdomain: true
        })
            .then(resp => {
                const { data } = resp.data
                const { results, status } = data;
                const { serpKeywords } = results;
                const { meta, related } = serpKeywords;
                if (status === 'ok' && related !== 'No data') {
                    const tableData = this.serpApiData(related, meta.keyword.trim().toLowerCase(), this.state.filter)
                    this.setState({
                        ...this.state,
                        serpData: tableData,
                        filter: { keywords: data.keywords, filter: data.filter }
                    })
                }
                else {
                    console.error('bad serp response:', related)
                    this.setState({
                        isLoading: false, error: 'bad serp response', showError: true // TODO: Manage Errors in UI
                    })
                }
            })
            .catch(error => {
                console.error('serp api error' + JSON.stringify(error))
                this.setState({ isLoading: false, error })
            });
    }

    serpApiData = (APIDATA, kywd, filter) => {
        let newKeywd = [], completeKywd = [], startKywd = [], containKywd = [], restKywd = [];
        // eslint-disable-next-line
        APIDATA.map((keywords) => {
            let sanitizedKywd = keywords.key.trim().toLowerCase();
            let flag = true;
            if (sanitizedKywd === kywd) {
                completeKywd.push(keywords);
                flag = false;
            }
            if (sanitizedKywd.substr(0, sanitizedKywd.length).indexOf(kywd) === 0) {
                startKywd.push(keywords);
                flag = false;
            }
            if (sanitizedKywd.substr(0, sanitizedKywd.length).indexOf(kywd) !== 0 && sanitizedKywd.substr(0, sanitizedKywd.length).indexOf(kywd) !== -1) {
                containKywd.push(keywords);
                flag = false;
            }
            if (flag) {
                restKywd.push(keywords);
            }
        })

        newKeywd = completeKywd.concat(startKywd, containKywd, restKywd);
        let serpStats = newKeywd.map((keywords, index) => {
            const row = {
                id: `${index}`,
                key: keywords.key,
                search_volume: keywords.search_volume,
                cpc: keywords.cpc,
                competition: keywords.competition
            };
            return row;
        })
        let filtered = this.serpFilter(serpStats, filter);
        return filtered;
    }


    serpFilter = (APIDATA, filter) => {
        const {
            minVolume, maxVolume, minAdwords, maxAdwords, minCPC, maxCPC, filterKeys, eraseKeys
        } = filter
        let newKeywd = [];
        // eslint-disable-next-line
        APIDATA.map(keywords => {
            if ((keywords.search_volume >= minVolume && keywords.search_volume <= maxVolume) &&
            (Math.floor((keywords.cpc + 0.01) * 100) / 100 >= minCPC &&
            Math.floor((keywords.cpc + 0.01) * 100) / 100 <= maxCPC) &&
            (Math.round(keywords.competition * 100) >= minAdwords &&
            Math.round(keywords.competition * 100) <= maxAdwords)) {
                
                if (eraseKeys === '') {
                    filterKeys.split('\n').forEach(element => {
                        if (keywords.key.includes(element)) {
                            newKeywd.push(keywords)
                        }
                    });
                }
                else {
                    filterKeys.split('\n').forEach(element => {
                        if (keywords.key.includes(element)) {
                            eraseKeys.split('\n').forEach(element => {
                                if (!keywords.key.includes(element)) {
                                    newKeywd.push(keywords)
                                }
                            }
                            )
                        }
                    });
                }
            }
        })

        let top20=newKeywd.filter((_item, id)=>id<20)

        let serpStats = top20.map((keywords, index) => {
            let comp = Math.round(keywords.competition * 100);
            if (comp === 0) { comp = 1; }
            const row = {
                id: `${index}`,
                key: keywords.key,
                search_volume: keywords.search_volume,
                cpc: Math.floor((keywords.cpc + 0.01) * 100) / 100 + '€',
                competition: comp
            };
            return row;
        })
        return serpStats;
    }

    rankedAPI = async (data = { keywords: '', select: '' }) => {
        console.log('ranked api call started')
        await axios({
            method: 'post',
            url: `http://backend.borjamediavilla.com/api/v1/serp/ranked`,
            data,
            crossdomain: true
        })
            .then((resp) => {
                const { data } = resp.data
                if (data.results) {
                    const { results } = data;
                    const { organic } = results
                    try {
                        const rankData = this.rankedSites(organic)
                        this.setState({
                            ...this.state,
                            rankData,
                        })
                    }
                    catch (error) {
                        console.log(error)
                        this.setState({
                            isLoading: false,
                            error: 'bad api ranked response:' + JSON.stringify(error),
                            showError: true
                        })
                    }
                }
                else {
                    const { status } = data
                    if (status === 'queued') {
                        console.error('bad ranked response:', status)
                        this.setState({
                            ...this.state,
                            error: 'bad ranked response:' + status,
                            isLoading: false,
                        })
                    }
                    else {
                        console.error('bad ranked response:', data.msg)
                    }
                }
            })
            .catch(error => {
                console.error('ranked api error' + JSON.stringify(error))
                this.setState({ isLoading: false, error })
            });
    }

    rankedSites = (ranked) => {
        let rankRows = ranked.filter(sitio => sitio.result_position < 11)
        let rankRow = rankRows.map((sitio) => {
            const { result_url, result_position, result_title } = sitio
            const row = {
                url: result_url,
                pos: result_position,
                title: result_title,
                shares: result_url,
                pda: result_url
            }
            return row
        })
        return rankRow
    }

    setPair = (key, value = { keywords: '' }) => {
        if (key === 'query') {
            this.setState({ showTables: true })
            this.serpAPI(value)
        }
        this.setState({ [key]: value })
    }
}

