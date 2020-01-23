import React, { Component } from 'react';
import '../css/app.less';
import TipOfTheDay from './tip-of-the-day/tip-of-the-day';

class App extends Component {
    render() {
        return (
            <div className="tip-app">
                <TipOfTheDay></TipOfTheDay>
            </div>
        );
    }
}

export default App;
