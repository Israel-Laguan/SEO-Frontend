import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Column } from '../style/GridStyles';
import Autocomplete from './Autocomplete';

const SearchFormView = ({
    setLanguages,
    setKeywords,
    submitQuery,
    keywords,
    lang,
    languages = [] }) => {
    return (
        <Row>
            <Column md={1}>
                <button disabled style={{ backgroundColor: "#04b509", height: '25px' }}>
                    <FontAwesomeIcon
                        icon="search"
                        flip="horizontal"
                        rotation={270}
                        style={{ marginTop: "0px", color: "white" }}
                    />
                </button>
            </Column>
            <Column md={4}>
                <InputText
                    type="text"
                    onChange={e => setKeywords(e.target.value)}
                    value={keywords}
                    placeholder={'Palabra Clave'}
                    required
                    autoComplete='true'
                    autoFocus
                />
            </Column>
            <Column md={5}>
                <Autocomplete
                    suggestions={languages.map(lang => lang.flag + lang.text)}
                    placeholder={'🇧🇴Bolivia / Spanish (Latin America) - Español (Latinoamérica)'}
                    value={lang==='🇧🇴 Bolivia / Spanish (Latin America) - Español (Latinoamérica)'?null:lang}
                    setLanguages={setLanguages}
                />
            </Column>
            <Column md={2}>
                <ButtonSearch
                    onClick={() => submitQuery()}
                >
                    Buscar
          </ButtonSearch>
            </Column>
        </Row>
    )
}

export default SearchFormView;

const Button = styled.button`
  background: #34d139;
  color: #fff;
  padding: 5px 10px;
  height: 45px;
  border: 2px solid #25a62a;
  border-radius: 1px 40px 40px 1px;
`

const ButtonSearch = styled(Button)`
  text-align: center;
  padding: 3px 3px;
  text-decoration: none;
  position: relative;
  right: 0px;
  height: 25px;
`

const InputText = styled.input`
  border: 1px solid #999;
  padding: 0.5rem;
  width: 100%;
  height: 25px;
  border: 2px solid green;
  border-radius: 3px;
  @media (max-width: 768px) {
    width: 90%;
  }
`
