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
            .then(res => displaySuccess(res.data.text), setCustomTip(''))
            .catch(err => displayError(err.response.data));

    const displayError = errorResponse => {
        let errorMessage = errorResponse.replace(/\"/g, '');
        errorMessage = errorMessage.includes('error') ? errorMessage.slice(7, errorMessage.length - 1) : errorMessage;
        setAlert({ message: errorMessage, type: 'error' });
    };

    const displaySuccess = tipMessage => {
        setAlert({ message: `Tip "${tipMessage}" has been added successfully!`, type: 'success' });
        setShowAddTip(false);
        setTimeout(() => setAlert(null), 2000);
    };

    const hideTipBlock = () => {
        if (showAddTip) {
            setCustomTip('');
            setShowAddTip(false);
            setAlert(null);
        } else {
            tipElement.current.style.height = 0;
            tipElement.current.style.overflow = 'hidden';
        }
    };

    let displayedTip = <div>Loading ...</div>;
    if (tip && !showAddTip) {
        displayedTip = (
            <>
                <div className="tip-area">
                    <h5 className="tip-area__recieved-tip" data-tip={tip.text}>
                        {tip.text}
                    </h5>
                </div>
                {tip.poster !== 'system' ? (
                    <div className="tip-author">
                        <p className="tip-author-field">
                            Added by user <a>{tip.poster}</a>&nbsp;
                        </p>
                        <p className="tip-author-field right-space"> at {convertDate(tip.posted)}</p>
                    </div>
                ) : null}
                <div className="tip-info">
                    <a className="actionIcon tip-btn" onClick={() => getRandomTip()}>
                        <i className="uiIconMiniArrowRight uiIconLightGray"></i>
                    </a>
                    <a className="actionIcon tip-btn" onClick={() => setShowAddTip(true)}>
                        <i className="uiIconSimplePlusMini uiIconLightGray"></i>
                    </a>
                </div>
                <ReactTooltip effect="solid" place="bottom" className="tip-tooltip" />
            </>
        );
    } else if (showAddTip) {
        displayedTip = (
            <>
                <div className="tip-area">
                    <textarea
                        rows="3"
                        value={customTip}
                        onChange={event => setCustomTip(event.target.value)}
                        placeholder="Enter your tip here."
                        className="tip-area__entered-tip right-space"
                    />
                </div>
                <button className="btn right-space" type="button" onClick={() => saveTip()}>
                    Save
                </button>
            </>
        );
    }

    let alertMessage = alert ? (
        <div className={'alert alert-' + alert.type} id="">
            <i className={alert.type === 'success' ? 'uiIconSuccess' : 'uiIconError'}></i>
            {alert.message}
        </div>
    ) : null;

    return (
        <div ref={tipElement}>
            <div className="tipBox">
                {alertMessage}
                <div className={'tipBox-container' + (showAddTip ? ' add-custom-tip' : '')}>
                    <i className="uiIconQuestion uiIconBlue right-space"></i>
                    {displayedTip}
                    <a className="actionIcon tip-btn tip-btn--close" onClick={() => hideTipBlock()}>
                        <i className="uiIconClose uiIconBlue"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default tipOfTheDay;
