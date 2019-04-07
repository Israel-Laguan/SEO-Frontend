import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
    faShareAlt,
    faSearch, 
    faLink, 
    faExternalLinkAlt, 
    faBlind,
    faAlignLeft,
    faListOl,
    faChartBar,
    faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import Layout from './Layout';

library.add(faSearch);
library.add(faShareAlt);
library.add(faLink );
library.add(faExternalLinkAlt);
library.add(faBlind);
library.add(faListOl);
library.add(faChartBar);
library.add(faAlignLeft);
library.add(faExclamationTriangle);

const Home = () => <Layout />


export default Home;