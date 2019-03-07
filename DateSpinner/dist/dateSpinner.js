/*!
* dateSpinner.js
* @author  Mrinmoy Roy (51607679)
* @version 0.1.0
* @email mrinmoy.r@hcl.com
*/

/*global define,module*/
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory)
    } else if (typeof exports === 'object') {
        module.exports = factory()
    } else {
        root.dateSpinner = factory()
    }
}(this, function() {

    /* ----------------------------------------------------------- */
    /* == Date Spinner Plugin */
    /* ----------------------------------------------------------- */

    function DateSpinner(options) {
        var defaults = {
            selector: null,
            onChange: null,
            defaultDate: null,
            yearStart: 1900,
            currentDate: null,
            dateFormat: 'MMM-DD-YYYY',
            changeMethods: ['click', 'touch', 'keydown']
        }
        this.opts = extend({}, defaults, options)
        this.init()
    }

    DateSpinner.prototype.init = function() {
        if (this.setSpinner) {
            return
        }

        buildSpinner.call(this)
        createDial.call(this)

        this.setSpinner.innerHTML = createSpinner(this.dialerList.monthList, this.dialerList.dayList, this.dialerList.yearList, this.opts.dateFormat);

        defaultDate = new Date(this.opts.defaultDate)
        this.opts.currentDate = defaultDate;
        currentDate = getDateByParts(defaultDate)
        jumpSpinToDate(this.setSpinner, currentDate.month, currentDate.day, currentDate.year, this.opts.yearStart)
        dateChange.call(this)
        eventBinder.call(this)
        checkForDialerEdgeDisable(this.setSpinner, this.opts.currentDate, this.opts.yearStart)

        return this
    }

    DateSpinner.prototype.setDate = function(newDate) {
        newDate = new Date(newDate)
        this.opts.currentDate = newDate;
        currentDate = getDateByParts(newDate)
        jumpSpinToDate(this.setSpinner, currentDate.month, currentDate.day, currentDate.year, this.opts.yearStart)
        dateChange.call(this);
    }

    DateSpinner.prototype.getDate = function() {
        newDate = new Date(this.opts.currentDate)
        currentDate = getDateByParts(newDate)
        return newDate;
    }

    DateSpinner.prototype.spinDayUp = function(e){
        this.opts.currentEvent = e;
        var currentDate = getDateByParts(this.opts.currentDate);
        var maxDays = new Date(currentDate.year, currentDate.month, 0).getDate()
        if(currentDate.day<maxDays){
            this.opts.currentDate = getCurrentDateObj(this.opts.currentDate, 'day', 'UP');
            spinItOnce(this.setSpinner.getElementsByClassName('day')[0].getElementsByClassName('before')[0], 'before', false);
            dateChange.call(this);
        }
    }

    DateSpinner.prototype.spinDayDown = function(e){
        this.opts.currentEvent = e;
        var currentDate = getDateByParts(this.opts.currentDate);
        if(currentDate.day>1){
            this.opts.currentDate = getCurrentDateObj(this.opts.currentDate, 'day', 'DOWN');
            spinItOnce(this.setSpinner.getElementsByClassName('day')[0].getElementsByClassName('after')[0], 'after', false);
            dateChange.call(this);
        }
    }

    DateSpinner.prototype.spinMonthUp = function(e){
        this.opts.currentEvent = e;
        var currentDate = getDateByParts(this.opts.currentDate);
        if(currentDate.month<12){
            this.opts.currentDate = getCurrentDateObj(this.opts.currentDate, 'month', 'UP');
            spinItOnce(this.setSpinner.getElementsByClassName('month')[0].getElementsByClassName('before')[0], 'before', false);
            currentDate = getDateByParts(this.opts.currentDate)
            //pass the element and number of days
            monthWiseDateLengthChange(this.setSpinner, new Date(currentDate.year, currentDate.month, 0).getDate(), currentDate.day, this.opts.currentDate, this.opts.yearStart);
            dateChange.call(this);
        }
    }

    DateSpinner.prototype.spinMonthDown = function(e){
        this.opts.currentEvent = e;
        var currentDate = getDateByParts(this.opts.currentDate);
        if(currentDate.month>1){
            this.opts.currentDate = getCurrentDateObj(this.opts.currentDate, 'month', 'DOWN');
            spinItOnce(this.setSpinner.getElementsByClassName('month')[0].getElementsByClassName('after')[0], 'after', false);
            var currentDate = getDateByParts(this.opts.currentDate)
            //pass the element and number of days
            monthWiseDateLengthChange(this.setSpinner, new Date(currentDate.year, currentDate.month, 0).getDate(), currentDate.day, this.opts.currentDate, this.opts.yearStart);
            dateChange.call(this);
        }
    }

    DateSpinner.prototype.spinYearUp = function(e){
        this.opts.currentEvent = e;
        var currentDate = getDateByParts(this.opts.currentDate);
        var maxYear = new Date()
        maxYear = maxYear.getFullYear()
        if(currentDate.year<maxYear){
            this.opts.currentDate = getCurrentDateObj(this.opts.currentDate, 'year', 'UP');
            spinItOnce(this.setSpinner.getElementsByClassName('year')[0].getElementsByClassName('before')[0], 'before', false);
            dateChange.call(this);
        }
    }

    DateSpinner.prototype.spinYearDown = function(e){
        this.opts.currentEvent = e;
        var currentDate = getDateByParts(this.opts.currentDate);
        if(currentDate.year>this.opts.yearStart){
            this.opts.currentDate = getCurrentDateObj(this.opts.currentDate, 'year', 'DOWN');
            spinItOnce(this.setSpinner.getElementsByClassName('year')[0].getElementsByClassName('after')[0], 'after', false);
            dateChange.call(this);
        }
    }

    function getCurrentDateObj(currentDate, dialType, direction){
        var currentDate = getDateByParts(currentDate);
        if(dialType=='month'){
            currentDate.month += direction=='UP'?(1):(-1);
        }
        if(dialType=='day'){
            currentDate.day += direction=='UP'?(1):(-1);
        }
        if(dialType=='year'){
            currentDate.year += direction=='UP'?(1):(-1);
        }
        maxDays = new Date(currentDate.year, currentDate.month, 0).getDate()
        if(currentDate.day>maxDays){
            currentDate.day = maxDays
        }
        currentDate.month = currentDate.month<10?('0'+currentDate.month):currentDate.month
        return new Date(currentDate.year+'/'+currentDate.month+'/'+currentDate.day)
    }

    function getDateByParts(date){
        // Get the Day, Month, Year of the specified date
        return {
            month: date.getMonth() + 1,
            day: date.getDate(),
            year: date.getFullYear()
        }
    }

    function createDial(){
        var defaultDate = this.opts.defaultDate?this.opts.defaultDate:new Date(); // Get default date or Set as today

        defaultDate = new Date(defaultDate)
        currentDate = getDateByParts(defaultDate)
        function daysInMonth (month, year) {
            return new Date(year, month, 0).getDate();
        }
        var monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var dayList = [];
        for(i=1;i<=daysInMonth (currentDate.month, currentDate.year);i++){
            dayList.push(i);
        } // Day list is created
        var yearStart = this.opts.yearStart?this.opts.yearStart:1990;
        var yearList = [];
        for(i=yearStart;i<=((new Date()).getUTCFullYear());i++){
            yearList.push(i);
        }
        this.dialerList = {
            monthList: monthList,
            dayList: dayList,
            yearList: yearList
        }
    }


    function buildSpinner() {
        var selector = this.opts.selector;
        selector = selector.slice(1);
        this.setSpinner = document.getElementById(selector);
    }

    function createSpinner(monthList, dayList, yearList, dateFormat){
        var x = '<div class="dateSpinner">';

        function addMonthList(monthList){
            x += '<div class="clip month"><i class="before"></i><div class="wrapper"><ul>'
            for(i in monthList){
                x += '<li value="'+(Number(i)+1)+'">'+ monthList[i] +'</li>';
            }
            x += '</ul></div><i class="after"></i></div>';
        }

        function addDayList(dayList){
            x += '<div class="clip day"><i class="before"></i><div class="wrapper"><ul>'
            for(i in dayList){
                x += '<li value="'+(Number(i)+1)+'">'+ dayList[i] +'</li>';
            }
            x += '</ul></div><i class="after"></i></div>';
        }

        function addYearList(yearList, keepYearList){
            keepYearList = keepYearList?keepYearList:yearList
            x += '<div class="clip year"><i class="before"></i><div class="wrapper"><ul>'
            for(i in yearList){
                x += '<li value="'+(keepYearList[i])+'">'+ yearList[i] +'</li>';
            }
            x += '</ul></div><i class="after"></i></div>';
        }

        var formatSetter = {
            'm': function(){
                var nMonth = []
                for(var m in monthList){
                    m = parseInt(m)
                    nMonth.push(m+1)
                }
                addMonthList(nMonth);
                return nMonth
            },
            'mm': function(){
                var nMonth = []
                for(var m in monthList){
                    m = parseInt(m)
                    nMonth.push(((m+1)<10?'0':'')+(m+1))
                }
                addMonthList(nMonth);
                return nMonth
            },
            'mmm': function(){
                addMonthList(monthList);
                return monthList
            },
            'd': function(){
                return dayList
                addDayList(dayList);
            },
            'dd': function(){
                var nDay = []
                for(d in dayList){
                    d = parseInt(d)
                    nDay.push(((d+1)<10?'0':'')+(d+1))
                }
                addDayList(nDay);
                return nDay
            },
            'yy': function(){
                var nYear = []
                for(var y in yearList){
                    y = parseInt(y)
                    nYear.push((yearList[y].toString()).substring(2))
                }
                addYearList(nYear, yearList);
                return nYear
            },
            'yyyy': function(){
                addYearList(yearList);
                return yearList
            }
        }

        function run(x){
            x()
        }

        dateFormat = dateFormat.toLowerCase()
        var delimeter = dateFormat.indexOf('-')>-1?'-':(dateFormat.indexOf('/')?'/':'')
        if(delimeter){
            var dateArr = dateFormat.split(delimeter);
            for(f in dateArr){
                run(formatSetter[dateArr[f]])
            }
        }

        x += '</div>';

        return x;
    }

    function dateChange(){
        newDate = new Date(this.opts.currentDate)
        currentDate = getDateByParts(newDate)
        self = this;
        if (typeof self.opts.onChange === 'function') {
            self.opts.onChange(self.opts.currentEvent?self.opts.currentEvent:{})
        }
        checkForDialerEdgeDisable(this.setSpinner, this.opts.currentDate, this.opts.yearStart)
        var monthLis = this.setSpinner.getElementsByClassName('month')[0].getElementsByTagName('li')
        var dayLis = this.setSpinner.getElementsByClassName('day')[0].getElementsByTagName('li')
        var yearLis = this.setSpinner.getElementsByClassName('year')[0].getElementsByTagName('li')
        for(i in monthLis){
            if(typeof monthLis[i]=='object'){
                monthLis[i].classList.remove('active')
                if(currentDate.month == monthLis[i].value){
                    monthLis[i].classList.add('active')
                }
            }
        }
        for(i in dayLis){
            if(typeof dayLis[i]=='object'){
                dayLis[i].classList.remove('active')
                if(currentDate.day == dayLis[i].value){
                    dayLis[i].classList.add('active')
                }
            }
        }
        for(i in yearLis){
            if(typeof yearLis[i]=='object'){
                yearLis[i].classList.remove('active')
                if(currentDate.year == yearLis[i].value){
                    yearLis[i].classList.add('active')
                }
            }
        }
    }

    function getTranslateY(obj){
        if(!window.getComputedStyle) return;
        var style = getComputedStyle(obj),
            transform = style.transform || style.webkitTransform || style.mozTransform;
        var mat = transform.match(/^matrix3d\((.+)\)$/);
        if(mat) return parseFloat(mat[1].split(', ')[13]);
        mat = transform.match(/^matrix\((.+)\)$/);
        return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
    }

    function getTransform(el) {
        var transform = window.getComputedStyle(el, null).getPropertyValue('-webkit-transform');

        function rotate_degree(matrix) {
            if (matrix !== 'none') {
                var values = matrix.split('(')[1].split(')')[0].split(',');
                var a = values[0];
                var b = values[1];
                var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
            } else {
                var angle = 0;
            }
            return (angle < 0) ? angle += 360 : angle;
        }

        var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+\.?\d*(?:, -{0,1}\d+\.?\d*)*(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*)), -{0,1}\d+\.?\d*\)|\(-{0,1}\d+\.?\d*(?:, -{0,1}\d+\.?\d*)*(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*))\))/);


        var result = [0, 0, 0];
        if (results) {
            if (results[1] == '3d') {
                result = results.slice(2, 5);
            } else {
                results.push(0);
                result = results.slice(5, 9); // returns the [X,Y,Z,1] value;
            }

            result.push(rotate_degree(transform));
        };
        return result;
    }

    function eventBinder() {

        this.spinEvents = {
            clickDayUp: this.spinDayUp.bind(this),
            clickDayDown: this.spinDayDown.bind(this),
            clickMonthUp: this.spinMonthUp.bind(this),
            clickMonthDown: this.spinMonthDown.bind(this),
            clickYearUp: this.spinYearUp.bind(this),
            clickYearDown: this.spinYearDown.bind(this)
        }

        var theEventMachine, theEventTimeout
        var self = this
        this.setSpinner.getElementsByClassName('day')[0].getElementsByClassName('before')[0].addEventListener('mousedown', function(e){
            self.spinEvents.clickDayUp(e)
            theEventTimeout = setTimeout(function(){
                theEventMachine = setInterval(function(){
                    self.spinEvents.clickDayUp(e)
                }, 180)
            }, 300)
        });
        this.setSpinner.getElementsByClassName('day')[0].getElementsByClassName('after')[0].addEventListener('mousedown', function(e){
            self.spinEvents.clickDayDown()
            theEventTimeout = setTimeout(function(){
                theEventMachine = setInterval(function(){
                    self.spinEvents.clickDayDown(e)
                }, 180)
            }, 300)
        });
        this.setSpinner.getElementsByClassName('month')[0].getElementsByClassName('before')[0].addEventListener('mousedown', function(e){
            self.spinEvents.clickMonthUp(e)
            theEventTimeout = setTimeout(function(){
                theEventMachine = setInterval(function(){
                    self.spinEvents.clickMonthUp(e)
                }, 180)
            }, 300)
        });
        this.setSpinner.getElementsByClassName('month')[0].getElementsByClassName('after')[0].addEventListener('mousedown', function(e){
            self.spinEvents.clickMonthDown(e)
            theEventTimeout = setTimeout(function(){
                theEventMachine = setInterval(function(){
                    self.spinEvents.clickMonthDown(e)
                }, 180)
            }, 300)
        });
        this.setSpinner.getElementsByClassName('year')[0].getElementsByClassName('before')[0].addEventListener('mousedown', function(e){
            self.spinEvents.clickYearUp(e)
            theEventTimeout = setTimeout(function(){
                theEventMachine = setInterval(function(){
                    self.spinEvents.clickYearUp(e)
                }, 180)
            }, 300)
        });
        this.setSpinner.getElementsByClassName('year')[0].getElementsByClassName('after')[0].addEventListener('mousedown', function(e){
            self.spinEvents.clickYearDown(e)
            theEventTimeout = setTimeout(function(){
                theEventMachine = setInterval(function(){
                    self.spinEvents.clickYearDown(e)
                }, 180)
            }, 300)
        });


        this.setSpinner.getElementsByClassName('day')[0].getElementsByClassName('before')[0].addEventListener('mouseup', function(){
            clearTimeout(theEventTimeout)
            clearInterval(theEventMachine)
        });
        this.setSpinner.getElementsByClassName('day')[0].getElementsByClassName('after')[0].addEventListener('mouseup', function(){
            clearTimeout(theEventTimeout)
            clearInterval(theEventMachine)
        });
        this.setSpinner.getElementsByClassName('month')[0].getElementsByClassName('before')[0].addEventListener('mouseup', function(){
            clearTimeout(theEventTimeout)
            clearInterval(theEventMachine)
        });
        this.setSpinner.getElementsByClassName('month')[0].getElementsByClassName('after')[0].addEventListener('mouseup', function(){
            clearTimeout(theEventTimeout)
            clearInterval(theEventMachine)
        });
        this.setSpinner.getElementsByClassName('year')[0].getElementsByClassName('before')[0].addEventListener('mouseup', function(){
            clearTimeout(theEventTimeout)
            clearInterval(theEventMachine)
        });
        this.setSpinner.getElementsByClassName('year')[0].getElementsByClassName('after')[0].addEventListener('mouseup', function(){
            clearTimeout(theEventTimeout)
            clearInterval(theEventMachine)
        });

        var touchStartedMemory = touchStarted = touchMoved = 0;
        var touchEfficiency = 2
        var measureMax = 100
        var pixleMoved = measureMax/(touchEfficiency<11?touchEfficiency:10)
        this.setSpinner.addEventListener("touchstart", function(e){
            if(e.changedTouches.length==1){
                event.preventDefault()
                touchStarted = e.changedTouches[0].clientY
                touchStartedMemory = e.changedTouches[0].clientY
                getTranslateYVal = getTranslateY(e.target.parentElement)
            }
        })
        var countDistance = 0;
        this.setSpinner.addEventListener("touchmove", function(e){
            if(e.changedTouches.length==1){
                event.preventDefault()
                touchMoved = e.changedTouches[0].clientY
                if(e.target.parentElement.nodeName=='UL'){
                    countDistance += touchMoved-touchStarted
                    e.target.parentElement.style.transform = 'translate3d(0px,' + (getTranslateYVal + countDistance) + 'px, 0px)'
                    var gap = e.target.clientHeight
                    if(touchMoved-touchStartedMemory<0 && touchStartedMemory-touchMoved>gap){
                        if(e.target.parentElement.parentElement.parentElement.classList.value.indexOf('day')>-1){
                            self.spinEvents.clickDayUp(e)
                        }
                        if(e.target.parentElement.parentElement.parentElement.classList.value.indexOf('month')>-1){
                            self.spinEvents.clickMonthUp(e)
                        }
                        if(e.target.parentElement.parentElement.parentElement.classList.value.indexOf('year')>-1){
                            self.spinEvents.clickYearUp(e)
                        }
                        touchStartedMemory = touchMoved
                    }
                    else if(touchMoved-touchStartedMemory>0 && touchMoved-touchStartedMemory>gap){
                        if(e.target.parentElement.parentElement.parentElement.classList.value.indexOf('day')>-1){
                            self.spinEvents.clickDayDown(e)
                        }
                        if(e.target.parentElement.parentElement.parentElement.classList.value.indexOf('month')>-1){
                            self.spinEvents.clickMonthDown(e)
                        }
                        if(e.target.parentElement.parentElement.parentElement.classList.value.indexOf('year')>-1){
                            self.spinEvents.clickYearDown(e)
                        }
                        touchStartedMemory = touchMoved
                    }
                    touchStarted = touchMoved
                    // self.setDate(self.opts.currentDate)
                }
            }
        })
        this.setSpinner.addEventListener("touchend", function(e){
            if(e.changedTouches.length==1){
                event.preventDefault()
                getTranslateYVal = getTranslateY(e.target.parentElement)
                self.setDate(self.opts.currentDate)
                touchStartedMemory = touchStarted = touchMoved = countDistance = 0;
            }
        })
    }

    function keyboardSpin(event) {e
        // escape key
        if (this.opts.closeMethods.indexOf('escape') !== -1 && event.which === 27 && this.isOpen()) {
            this.close()
        }
    }

    function checkForDialerEdgeDisable(primaryElement, date, yearStart){
        primaryElement.getElementsByClassName('month')[0].getElementsByClassName('before')[0].classList.remove('disabled')
        primaryElement.getElementsByClassName('month')[0].getElementsByClassName('after')[0].classList.remove('disabled')
        primaryElement.getElementsByClassName('day')[0].getElementsByClassName('before')[0].classList.remove('disabled')
        primaryElement.getElementsByClassName('day')[0].getElementsByClassName('after')[0].classList.remove('disabled')
        primaryElement.getElementsByClassName('year')[0].getElementsByClassName('before')[0].classList.remove('disabled')
        primaryElement.getElementsByClassName('year')[0].getElementsByClassName('after')[0].classList.remove('disabled')
        currentDate = getDateByParts(date);
        if(currentDate.month==12){
            primaryElement.getElementsByClassName('month')[0].getElementsByClassName('before')[0].classList.add('disabled')
        }
        if(currentDate.month==1){
            primaryElement.getElementsByClassName('month')[0].getElementsByClassName('after')[0].classList.add('disabled')
        }
        var maxDays = new Date(currentDate.year, currentDate.month, 0).getDate()
        if(currentDate.day==maxDays){
            primaryElement.getElementsByClassName('day')[0].getElementsByClassName('before')[0].classList.add('disabled')
        }
        if(currentDate.day==1){
            primaryElement.getElementsByClassName('day')[0].getElementsByClassName('after')[0].classList.add('disabled')
        }
        if(currentDate.year==new Date().getFullYear()){
            primaryElement.getElementsByClassName('year')[0].getElementsByClassName('before')[0].classList.add('disabled')
        }
        if(currentDate.year==yearStart){
            primaryElement.getElementsByClassName('year')[0].getElementsByClassName('after')[0].classList.add('disabled')
        }
    }

    function spinItOnce(primaryElement, direction, silent){
        var gap = primaryElement.parentElement.getElementsByClassName('wrapper')[0].getElementsByTagName('ul')[0].getElementsByTagName('li')[0].clientHeight;
        var currentMargin = getTranslateY(primaryElement.parentElement.getElementsByClassName('wrapper')[0].getElementsByTagName('ul')[0])?getTranslateY(primaryElement.parentElement.getElementsByClassName('wrapper')[0].getElementsByTagName('ul')[0]):0;
        var childLength = primaryElement.parentElement.getElementsByClassName('wrapper')[0].getElementsByTagName('ul')[0].childNodes.length;
        if(direction=='before'){
            if(!silent){
                primaryElement.parentElement.getElementsByClassName('wrapper')[0].getElementsByTagName('ul')[0].style.transform = 'translate3d(0px,' + (currentMargin - gap) + 'px, 0px)';
                spinItOnce(primaryElement, direction, true);
            }
        }
        else if(direction=='after'){
            if(!silent){
                primaryElement.parentElement.getElementsByClassName('wrapper')[0].getElementsByTagName('ul')[0].style.transform = 'translate3d(0px,' + (currentMargin + gap) + 'px, 0px)';
                spinItOnce(primaryElement, direction, true);
            }
        }
    }

    function jumpSpinToDate(primaryElement, month, day, year, yearStart){
        if(year<yearStart){
            console.error('The year you are about to set is older than the mentioned start year')
        }
        var gap = primaryElement.parentElement.getElementsByClassName('wrapper')[0].getElementsByTagName('ul')[0].getElementsByTagName('li')[0].clientHeight;
        primaryElement.getElementsByClassName('month')[0].getElementsByClassName('wrapper')[0].getElementsByTagName('ul')[0].style.transform = 'translate3d(0px,' + ((month-1)*gap*(-1)) + 'px, 0px)'
        primaryElement.getElementsByClassName('day')[0].getElementsByClassName('wrapper')[0].getElementsByTagName('ul')[0].style.transform = 'translate3d(0px,' + ((day-1)*gap*(-1)) + 'px, 0px)'
        primaryElement.getElementsByClassName('year')[0].getElementsByClassName('wrapper')[0].getElementsByTagName('ul')[0].style.transform = 'translate3d(0px,' + ((year-yearStart)*gap*(-1)) + 'px, 0px)'
        for(i in [0, 1, 2]){
            spinItOnce(primaryElement.getElementsByClassName('clip')[i].getElementsByClassName('before')[0], 'before', true);
            spinItOnce(primaryElement.getElementsByClassName('clip')[i].getElementsByClassName('after')[0], 'after', true);
        }
    }

    function monthWiseDateLengthChange(elem, daysCount, day, date, yearStart){
        var x = '';
        for(i=0; i<daysCount; i++){
            x += '<li value="'+(Number(i)+1)+'">'+ (i+1) +'</li>';
        }
        elem.getElementsByClassName('day')[0].getElementsByTagName('ul')[0].innerHTML = x
        if(daysCount<=day){
            currentDate = getDateByParts(date)
            jumpSpinToDate(elem, currentDate.month, currentDate.day, currentDate.year, yearStart)
        }
    }


    function extend() {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key]
                }
            }
        }
        return arguments[0]
    }


    /* ----------------------------------------------------------- */
    /* == return */
    /* ----------------------------------------------------------- */

    return {
        setSpinner: DateSpinner
    }

}))
