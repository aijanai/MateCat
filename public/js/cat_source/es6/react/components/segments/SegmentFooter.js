/**
 * React Component .

 */
var React = require('react');
var SegmentConstants = require('../../constants/SegmentConstants');
var SegmentStore = require('../../stores/SegmentStore');
// var SegmentTabMatches = require('./SegmentFooterTabMatches').default;
var SegmentTabConcordance = require('./SegmentFooterTabConcordance').default;
var SegmentTabGlossary = require('./SegmentFooterTabGlossary').default;
var SegmentTabConflicts = require('./SegmentFooterTabConflicts').default;
var SegmentTabMessages = require('./SegmentFooterTabMessages').default;
var SegmentTabRevise = require('./SegmentFooterTabRevise').default;
class SegmentFooter extends React.Component {

    constructor(props) {
        super(props);
        let tMLabel;
        if ( config.mt_enabled ) {
            tMLabel =  'Translation Matches';
        }
        else {
            tMLabel = 'Translation Matches' + " (No MT) ";
        }
        this.tabs = {
            matches: {
                label: tMLabel,
                code : 'tm',
                tab_class : 'matches',
                enabled: false,
                visible: false,
                open: false,
                elements: []
            },
            concordances: {
                label: 'Concordance',
                code : 'cc',
                tab_class : 'concordances',
                enabled : false,
                visible : false,
                open : false,
                elements : []
            },
            glossary: {
                label : 'Glossary',
                code : 'gl',
                tab_class : 'glossary',
                enabled : false,
                visible : false,
                open : false,
                elements : []
            },
            alternatives: {
                label : 'Translation conflicts',
                code : 'al',
                tab_class : 'alternatives',
                enabled : false,
                visible : false,
                open : false,
                elements : []
            },
            messages: {
                label : 'Messages',
                code : 'notes',
                tab_class : 'segment-notes',
                enabled : !!(this.props.segment.notes && this.props.segment.notes.length > 0),
                visible : !!(this.props.segment.notes && this.props.segment.notes.length > 0),
                open : !!(this.props.segment.notes && this.props.segment.notes.length > 0),
                elements : []
            },
            review : {
                label : 'Revise',
                code : 'review',
                tab_class : 'review',
                enabled : false,
                visible : false,
                open : false,
                elements : []
            }
        };

        let hideMatches = this.getHideMatchesCookie();
        this.state = {
            tabs: {},
            hideMatches : hideMatches
        };
        this.registerTab = this.registerTab.bind(this);
        this.createFooter = this.createFooter.bind(this);
        this.getTabContainer = this.getTabContainer.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.openTab = this.openTab.bind(this);
        this.addTabIndex = this.addTabIndex.bind(this);
    }

    registerTab(tabName, visible, open) {
        this.tabs[tabName].visible = visible;
        // Ensure there is only one tab open.
        if (open === true) {
            for (var key in this.tabs) {
                this.tabs[key].open = false;
            }
        }
        this.tabs[tabName].open = this.state.hideMatches ? false : open;
        this.tabs[tabName].enabled = true;
    }

    createFooter(sid) {
        if (this.props.sid == sid) {
            this.setState({
                tabs: this.tabs
            });
        }
    }

    getTabContainer(tab, active_class) {
        var open_class = (active_class == 'active') ? 'open' : '';
        switch(tab.code) {
            case 'tm':
                return <SegmentTabMatches
                    key={"container_" + tab.code}
                    code = {tab.code}
                    active_class = {open_class}
                    tab_class = {tab.tab_class}
                    id_segment = {this.props.sid}
                    segment = {this.props.segment}
                />;
                break;
            case 'cc':
                return <SegmentTabConcordance
                    key={"container_" + tab.code}
                    code = {tab.code}
                    active_class = {open_class}
                    tab_class = {tab.tab_class}
                    id_segment = {this.props.sid}/>;
                break;
            case 'gl':
                return <SegmentTabGlossary
                    key={"container_" + tab.code}
                    code = {tab.code}
                    active_class = {open_class}
                    tab_class = {tab.tab_class}
                    id_segment = {this.props.sid}/>;
                break;
            case 'al':
                return <SegmentTabConflicts
                    key={"container_" + tab.code}
                    code = {tab.code}
                    active_class = {open_class}
                    tab_class = {tab.tab_class}
                    id_segment = {this.props.sid}/>;
                break;
            case 'notes':
                return <SegmentTabMessages
                    key={"container_" + tab.code}
                    code = {tab.code}
                    active_class = {open_class}
                    tab_class = {tab.tab_class}
                    id_segment = {this.props.sid}
                    notes={this.props.segment.notes}/>;
                break;
            case 'review':
                return <SegmentTabRevise
                    key={"container_" + tab.code}
                    code = {tab.code}
                    active_class = {open_class}
                    tab_class = {tab.tab_class}
                    id_segment = {this.props.sid}
                    translation={this.props.segment.translation}
                    segment={this.props.segment}
                    decodeTextFn={this.props.decodeTextFn}/>;
                break;
            default:
                return ''
        }
    }
    closeAllTabs() {
        let tabs = jQuery.extend(true, {}, this.state.tabs);
        for ( var item in tabs ) {
            tabs[item].open = false
        }
        this.setState({
            tabs: tabs
        });
    }

    openTab(sid, tabCode) {
        // Todo: refactoring, no jquery
        if (this.props.sid === sid ) {
            this.changeTab(tabCode, true);
        }
    }

    setHideMatchesCookie(hideMatches) {
        var cookieName = (config.isReview)? 'hideMatchesReview' : 'hideMatches';
        Cookies.set(cookieName + '-' + config.id_job, hideMatches, { expires: 30 });
    }

    getHideMatchesCookie() {
        var cookieName = (config.isReview)? 'hideMatchesReview' : 'hideMatches';
        if( !_.isUndefined(Cookies.get(cookieName + '-' + config.id_job)) && Cookies.get(cookieName + '-' + config.id_job) == "true") {
            return true;
        }
        return false;
    }

    changeTab(tabName, forceOpen) {
        if (event) {
            event.preventDefault();
        }
        forceOpen = forceOpen ? forceOpen : false;
        let tabs = jQuery.extend(true, {}, this.state.tabs);
        let tab = jQuery.extend(true, {}, tabs[tabName]);
        //Close all tabs
        for ( var item in tabs ) {
            tabs[item].open = false
        }
        if (tab.open && !forceOpen) {
            tab.open = false;
            this.setHideMatchesCookie(true);
        } else {
            tab.open = true;
            tab.visible = true;
            this.setHideMatchesCookie(false);
        }
        tabs[tabName] = tab;

        this.setState({
            tabs: tabs,
            hideMatches: !tab.open
        });
    }
    componentDidMount() {
        console.log("Mount SegmentFooter" + this.props.sid);
        SegmentStore.addListener(SegmentConstants.CREATE_FOOTER, this.createFooter);
        SegmentStore.addListener(SegmentConstants.REGISTER_TAB, this.registerTab);
        SegmentStore.addListener(SegmentConstants.OPEN_TAB, this.openTab);
        SegmentStore.addListener(SegmentConstants.ADD_TAB_INDEX, this.addTabIndex);
        SegmentStore.addListener(SegmentConstants.CLOSE_TABS, this.closeAllTabs);
    }

    componentWillUnmount() {
        console.log("Unmount SegmentFooter" + this.props.sid);
        SegmentStore.removeListener(SegmentConstants.CREATE_FOOTER, this.createFooter);
        SegmentStore.removeListener(SegmentConstants.REGISTER_TAB, this.registerTab);
        SegmentStore.removeListener(SegmentConstants.OPEN_TAB, this.openTab);
        SegmentStore.removeListener(SegmentConstants.ADD_TAB_INDEX, this.addTabIndex);
        SegmentStore.removeListener(SegmentConstants.CLOSE_TABS, this.closeAllTabs);
    }

    componentWillMount() {

    }

    allowHTML(string) {
        return { __html: string };
    }

    addTabIndex(sid, tab, index) {
        if (this.props.sid == sid) {
            let tabs = $.extend(true, {}, this.state.tabs);
            if (tabs[tab]) {
                tabs[tab].index = index;
                this.setState({
                    tabs: tabs
                })
            }
        }
    }

    render() {
        var labels = [];
        var containers = [];
        var self = this;
        for ( var key in this.state.tabs ) {
            var tab = this.state.tabs[key];
            if ( tab.enabled) {
                var hidden_class = (tab.visible) ? '' : 'hide';
                var active_class = (tab.open && !this.state.hideMatches) ? 'active' : '';
                var label = <li
                    key={ tab.code }
                    ref={(elem)=> this[tab.code] = elem}
                    className={ hidden_class + " " + active_class + " tab-switcher tab-switcher-" + tab.code }
                    id={"segment-" + this.props.sid + tab.code}
                    data-tab-class={ tab.tab_class }
                    data-code={ tab.code }
                    onClick={ self.changeTab.bind(this, key, false) }>
                    <a tabIndex="-1" >{ tab.label }
                        <span className="number">{(tab.index) ? ' (' + tab.index + ')' : ''}</span>
                    </a>
                </li>;
                labels.push(label);
                let container = self.getTabContainer(tab, active_class);
                containers.push(container);
            }
        }

        return (
            <div className="footer toggle"
                 ref={(ref) => this.footerRef = ref}>
                <ul className="submenu">
                    {labels}
                </ul>
                {containers}
                <div className="addtmx-tr white-tx">
                    <a className="open-popup-addtm-tr">Add private resources</a>
                </div>
            </div>
        )
    }
}

export default SegmentFooter;
