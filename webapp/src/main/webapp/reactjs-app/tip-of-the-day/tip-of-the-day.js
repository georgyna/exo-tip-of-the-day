import React, { useEffect, useState, useRef } from 'react';
import './tip-of-the-day.less';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';

const tipOfTheDay = () => {
    const [tip, setTip] = useState();
    const [customTip, setCustomTip] = useState('');
    const [alert, setAlert] = useState(null);
    const [showAddTip, setShowAddTip] = useState(false);

    const tipElement = useRef(null);

    useEffect(() => {
        getRandomTip();
    }, []);

    const getRandomTip = () =>
        axios
            .get('/portal/rest/tipoftheday/random')
            .then(res => {
                setAlert(null);
                setTip(res.data);
            })
            .catch(err => displayError(err.response.data));

    const convertDate = timestamp => {
        const convertedDate = new Date(timestamp);
        return `${convertedDate.getDate().toString()}-${(
            convertedDate.getMonth() + 1
        ).toString()}-${convertedDate
            .getFullYear()
            .toString()} ${convertedDate.getHours().toString()}:${convertedDate.getMinutes().toString()}`;
    };

    const saveTip = () =>
        axios
            .post('/portal/rest/tipoftheday/tip', 'text=' + encodeURIComponent(customTip), {
                headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            })
            .then(res => setAlert({ message: `Tip "${res.data.text}" has been added successfully!`, type: 'success' }))
            .catch(err => displayError(err.response.data));

    const displayError = errorResponse => {
        let errorMessage = errorResponse.replace(/\"/g, '');
        errorMessage = errorMessage.includes('error') ? errorMessage.slice(7, errorMessage.length - 1) : errorMessage;
        setAlert({ message: errorMessage, type: 'error' });
    };

    const hideTipBlock = () => {
        tipElement.current.style.height = 0;
        tipElement.current.style.overflow = 'hidden';
        tipElement.current.style.border = 'none';
    };

    let recievedTip = <div>Loading ...</div>;
    if (tip) {
        recievedTip = (
            <div className="tipBox-container">
                <div className="tip-text">
                    <i className="uiIconQuestion uiIconBlue right-space"></i>
                    <h4 className="tip-text-header" data-tip={tip.text}>
                        {tip.text}
                    </h4>
                </div>
                <div className="tip-info-area">
                    {tip.poster !== 'system' ? (
                        <React.Fragment>
                            <p className="tip-info">
                                Добавлено пользователем <a>{tip.poster}</a>
                            </p>
                            &nbsp;
                            <p className="tip-info right-space"> в {convertDate(tip.posted)}</p>
                        </React.Fragment>
                    ) : null}
                    <a className="actionIcon tip-btn" onClick={() => getRandomTip()}>
                        <i className="uiIconMiniArrowRight uiIconLightGray"></i>
                    </a>
                    <a className="actionIcon tip-btn" onClick={() => setShowAddTip(true)}>
                        <i className="uiIconSimplePlusMini uiIconLightGray"></i>
                    </a>
                    <a className="actionIcon tip-btn" onClick={() => hideTipBlock()}>
                        <i className="uiIconClose uiIconBlue"></i>
                    </a>
                </div>
                <ReactTooltip effect="solid" place="bottom" />
            </div>
        );
    }
    let alertMessage = alert ? (
        <div className={'alert alert-' + alert.type} id="">
            <i className={alert.type === 'success' ? 'uiIconSuccess' : 'uiIconError'}></i>
            {alert.message}
        </div>
    ) : null;

    let addTipContainer = showAddTip ? (
        <div className="tipBox-add-container">
            <i className="uiIconQuestion uiIconBlue right-space"></i>
            <textarea
                rows="2"
                value={customTip}
                onChange={event => setCustomTip(event.target.value)}
                placeholder="Напишите свой совет дня"
                className="right-space add-tip-area"
            ></textarea>
            <button className="btn right-space" type="button" onClick={() => saveTip()}>
                Save
            </button>
            <a className="actionIcon tip-btn" onClick={() => setShowAddTip(false)}>
                <i className="uiIconClose uiIconBlue"></i>
            </a>
        </div>
    ) : null;

    return (
        <div className="tipBox" ref={tipElement}>
            {alertMessage}
            <h2>Совет дня</h2>
            {recievedTip}
            {addTipContainer}
        </div>
    );
};

export default tipOfTheDay;
