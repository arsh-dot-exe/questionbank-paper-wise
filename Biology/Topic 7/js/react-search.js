/* script that allows search react components to talk to jquery */

var template = 'search.pug'
var ts = (RC.isProductionServer) ? Math.floor(Date.now() / 600000) : Date.now()
var reactDispatchAction // this will be initialized in the react app to point to the search.dispatchAction function
var dt = new Date()
var month = dt.getMonth() + 1
if (month < 10) month = '0' + month
var day = dt.getDate()
if (day < 10) day = '0' + day
//var datePickerEndDate = month + '/' + day + '/' + dt.getFullYear()
var datePickerOptions = { autoclose: true, startView: 2, startDate: "01/01/1976" } // , endDate: datePickerEndDate

// call react function to set tab
function help() {
    reactDispatchAction('SET_VIEW', { tab: 'TAB_HELP' })
}

//
function setDatePicker(id, type) {
    console.log('react-search.setDatePicker: ', id, type)
    if ($('#' + id).length) {
        var selector = (type === 'range') ? '#' + id + ' .input-daterange' : '#' + id + ' .input-group.date'
        //var selector = (type === 'range') ? '#' + id + ' .input-daterange' : '#' + id + ' .input-date' // autoclose does not work
        $(selector).datepicker(datePickerOptions)
    }
}

// remove datepicker obj when it is unmounted
function removeDatePicker(id) {
    console.log('react-search.removeDatePicker: ', id)
    if ($('#' + id).length) $('#' + id).datepicker('remove')
}

function setDispatchAction(func) {
    reactDispatchAction = func
}

// for dev view objects
function toggleAll(id) {
    //console.log('toggleAll', id)
    var o = $('#tbody' + id)
    if (o.is(':visible')) {
        o.hide()
        o.find('tbody').hide()
    } else {
        o.show()
        o.find('tbody').show()
    }
}

// for dev view objects
function toggleStateObj(id) {
    //console.log('toggleStateObj', id)
    var o = $('#tbody' + id)
    if (o.is(':visible')) o.hide()
    else o.show()
}

/*
Note: during development the non-minimized version of the bootstrap-datepicker.js library is used, because some modifications were made to that file
<td className='calendar-input'>
    <div id={this.calendarId}>
        <div className="input-group date"> // el
            <input
                type="text"
                value={value}
                id={guid}
                name={rule.id}
                className="form-control"
                placeholder={placeholder}
                autoComplete='off' />
            <span className="input-group-addon">{s.calendarIcon}</span>

            // range
            <div id={this.calendarId}>
                <div className="input-daterange input-group" id="datepicker"> // el
                    <input type="text" className="input-sm form-control" name="start" />
                    <span className="input-group-addon">to</span>
                    <input type="text" className="input-sm form-control" name="end" />
                </div>
            </div>

*/
function updateSearch(element, value) {
    console.log('updateSearch: ' + value)
    /*
    for(var p in element) {
        if (typeof element[p] !== 'function') {
            console.log(p + ' = ' + element[p])
        }
    }
    console.log('----------')
    */

    var el = element[0]
    /*
    for(var p in el) {
        if (typeof el[p] !== 'function') {
            console.log(p + ' = ' + el[p])
        }
    }
    */

    console.log('el.nodeName=' + el.nodeName)
    console.log('el.className=' + el.className)
    console.log('el.id=' + el.id)

    var limit, terminal_id
    if (el.nodeName === 'INPUT') { // DIV|INPUT
        console.log('range')
        limit = (el.name === 'start') ? 'from' : 'to'
        terminal_id = el.id.replace(el.name, '')
    } else {
        console.log('el.children.length=' + el.children.length)
        console.log('el.children[0].id=' + el.children[0].id)
        console.log('el.children[0].name=' + el.children[0].name)

        if (el.children[0]) {
            var input = el.children[0]
            terminal_id = input.name
        }
    }
    console.log('updateSearch:', limit, terminal_id, value)
    reactDispatchAction('QB_ATTRIBUTE_SET_VALUE', { limit, terminal_id, value })
}

// track in google analytics
function sendGtag(event_category, event_action, event_label) {
    if (typeof gtag !== 'undefined') { // for classic
        gtag('event', event_action, { event_category, event_label })
    }
}

/*
    control the order of search component loading - search.[min.]js is only loaded after dependencies are loaded

    note:   if this function is called from the DOMContentLoaded listener, then an 'event' object is passed as the arg, so we need to
            first check if counter.n has been set
*/
function loadSearch(counter) {
    if (!counter || typeof counter.n === 'undefined') counter = { n: 0, bodyLoaded: false, metadataLoaded: false }
    console.log('loadSearch:', 'counter.n=' + counter.n)

    if (document.body && !counter.bodyLoaded) {
        console.log('loadSearch: document.body LOADED')
        counter.bodyLoaded = true
    }
    if (metadata.chemical.drilldownAttributeMap && !counter.metadataLoaded) {
        console.log('loadSearch: metadata LOADED')
        counter.metadataLoaded = true
    }

    var { bodyLoaded, metadataLoaded } = counter

    if (bodyLoaded && metadataLoaded) {
        console.log('loadSearch: RC.isProductionServer=' + RC.isProductionServer)
        var search = document.createElement('script')
        search.src = '/build/js/search.js?ts=' + ts
        document.body.appendChild(search)
        search.onload = search.onreadystatechange = () => console.log('SEARCH LOADED')
    } else {
        counter.n++
        if (counter.n < 40) setTimeout(() => loadSearch(counter), 250)
        else console.log('ERROR: UNABLE TO LOAD ALL SEARCH COMPONENTS AFTER ' + counter.n + ' ATTEMPTS: ' + JSON.stringify({ reactLoaded, bodyLoaded, metadataLoaded }))
    }
}

if (document.readyState === 'loading') {  // loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', loadSearch)
} else {  // DOMContentLoaded has already fired
    loadSearch()
}

/*
    submit data to server as a GET request

    - param 'o' may be a click event or a link object
        - if event, get href from o.target, otherwise get directly from o

    - derive 'href', 'file', and 'source_db' from the link that was clicked:
        href=https://alphafold.ebi.ac.uk/files/AF-A0A023FDY8-F1-model_v3.cif
        href=https://www.modelarchive.org/api/projects/ma-bak-cepc-0001?type=basic__model_file_name

    - derive 'page' from window.location.pathname:
        /search
        /structure/MA_MABAKCEPC0001
*/
function submitUserAction(o) {
    try {
        console.log('submitUserAction')

        if (o) {
            var { href } = (o.href) ? o : o.target
            var { pathname } = window.location
            var arr = href.split('/')
            var file = arr[arr.length - 1]
            var page = pathname.split('/')[1] // get first non-empty element, for example: search, structure, annotation
            var source_db = 'unknown'

            if (href.indexOf('alphafold') !== -1) source_db = 'alphafold'
            else if (href.indexOf('modelarchive') !== -1) source_db = 'modelarchive'

            if (file.indexOf('?') !== - 1) file = file.substring(0, file.indexOf('?')) // remove modelarchive qs

            var data = [ page, source_db, file ]
            var url = '/user-action/download-csm/' + data.join('/')

            //console.log('url=' + url)

            $.ajax({
                type: 'GET',
                url,
            }).done((res) => {
                //console.log(res) // server sends back 'ok'
            })
        }
    } catch(e) {
        console.log(e)
    }
}

// submit action data to tracking server - old test version - currently disabled
function submitAction(o) {
    var disabled = true

    if (!disabled) {
        var action = (typeof o === 'object') ? o.href : o // o may be <a> element, or string

        console.log('action', typeof o, action)

        // submit data
        $.ajax({
            type: 'POST',
            url: '/test/action',
            data: { action }
        }).done(function(data) {
            //console.log(data)
        })
    }
}