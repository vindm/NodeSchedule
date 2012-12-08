Ext.define('Sched.view.lesson.DatePicker', {
    extend: 'Ext.DatePicker',
    alias: 'widget.dPicker',
    showToday: false,
    keyNav: false,
    startDay: 1,
    monthYearFormat: "F'y",
    config: {
        month: 0,
        isFirst: false,
        isLast: false,
        values: [],
        enabledDay: false
    },

    renderTpl: [
        '<div id="{id}-innerEl" role="grid">',
            '<div role="presentation" class="{baseCls}-header">',

            '<tpl if="isFirst">',
                '<div class="{baseCls}-prev"><a id="{id}-prevEl" href="#" role="button" title="{prevText}"></a></div>',
            '</tpl>',

            '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',

            '<tpl if="isLast">',
                '<div class="{baseCls}-next"><a id="{id}-nextEl" href="#" role="button" title="{nextText}"></a></div>',
            '</tpl>',

            '</div>',

            '<table id="{id}-eventEl" class="{baseCls}-inner" cellspacing="0" role="presentation">',
                '<thead role="presentation"><tr role="presentation">',
                '<tpl for="dayNames">',
                    '<th role="columnheader" title="{.}"><span>{.:this.firstInitial}</span></th>',
                '</tpl>',
                '</tr></thead>',
                '<tbody role="presentation"><tr role="presentation">',
                '<tpl for="days">',
                    '{#:this.isEndOfWeek}',
                    '<td role="gridcell" id="{[Ext.id()]}">',
                        '<a role="presentation" href="#" hidefocus="on" class="{parent.baseCls}-date" tabIndex="1">',
                            '<em role="presentation"><span role="presentation"></span></em>',
                        '</a>',
                    '</td>',
                '</tpl>',
                '</tr></tbody>',
            '</table>',
        '</div>',
        {
            firstInitial: function(value) {
                return Ext.picker.Date.prototype.getDayInitial(value);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            }
        }
    ],

    initComponent: function () {
        var me = this,
            dt = new Date();

        me.value = new Date(dt.setMonth(me.month, 1));

        me.callParent();

        me.todayCls = me.baseCls;
    },

    initEvents: function(){
        var me = this,
            eDate = Ext.Date,
            day = eDate.DAY;

        if ( me.isFirst ) {
            me.prevRepeater = new Ext.util.ClickRepeater(me.prevEl, {
                handler: function() {
                    me.fireEvent('gMonthChange', -1);
                },
                scope: me,
                preventDefault: true,
                stopDefault: true
            });
        }

        if ( me.isLast ) {
            me.nextRepeater = new Ext.util.ClickRepeater(me.nextEl, {
                handler: function() {
                    me.fireEvent('gMonthChange', 1);
                },
                scope: me,
                preventDefault:true,
                stopDefault:true
            });
        }

        me.eventEl.on('click', me.handleDateClick, me, {
            delegate: 'a.' + me.baseCls + '-date'
        });

        me.update(me.value);
    },

    changeMonth: function(dir, vals) {
        var me = this;
        me.values = vals;
        dir > 0 ? me.showNextMonth() : me.showPrevMonth();
    },

    beforeRender: function () {
        var me = this;
        me.callParent();
        Ext.apply(me.renderData, {
            isFirst: me.isFirst,
            isLast: me.isLast
        });
    },

    handleDateClick : function(e, t){
        var me = this,
            handler = me.handler,
            parent = Ext.fly(t.parentNode);

        e.stopEvent();

        if(me.disabled || !t.dateValue || !parent.hasCls(me.activeCls)) return;

        me.doCancelFocus = me.focusOnSelect === false;

        var value = new Date(t.dateValue),
            selected = parent.hasCls(me.selectedCls);

        if ( selected ) {
            me.removeValue( value );
            me.fireEvent('removeValue', me, value);
        } else {
            me.setValue( value );
            me.fireEvent('addValue', me, value);
        }

        delete me.doCancelFocus;
        handler && handler.call(me.scope || me, me, me.value);
        me.onSelect();

    },
    handleMouseWheel: function () {
        console.log('wheel');
    },

    setValue : function(value) {
        value = Ext.Date.clearTime(value, true);

        this.values.push( value.getDate() );
        this.selectedUpdate(value, true);
    },
    removeValue: function (value) {
        value = Ext.Date.clearTime(value, true);

        Ext.Array.remove(this.values, value.getDate());
        return this.selectedUpdate(value, false);
    },

    selectedUpdate: function(date, select){
        var me        = this,
            t         = date.getTime(),
            cells     = me.cells,
            cls       = me.selectedCls,
            cellItems = cells.elements,
            c,
            cLen      = cellItems.length,
            cell;

        for (c = 0; c < cLen; c++) {
            cell = Ext.fly(cellItems[c]);

            if (cell.dom.firstChild.dateValue == t) {

                select ? cell.addCls(cls) : cell.removeCls(cls);

                if (me.isVisible() && !me.doCancelFocus) {
                    Ext.fly(cell.dom.firstChild).focus(50);
                }

                break;
            }
        }
    },
    fullUpdate: function(date){
        var me = this,
            cells = me.cells.elements,
            textNodes = me.textNodes,
            disabledCls = me.disabledCellCls,
            eDate = Ext.Date,
            i = 0,
            extraDays = 0,
            visible = me.isVisible(),
            sel = +eDate.clearTime(date, true),
            today = +eDate.clearTime(new Date()),
            min = me.minDate ? eDate.clearTime(me.minDate, true) : Number.NEGATIVE_INFINITY,
            max = me.maxDate ? eDate.clearTime(me.maxDate, true) : Number.POSITIVE_INFINITY,
            ddMatch = me.disabledDatesRE,
            ddText = me.disabledDatesText,
            ddays = me.disabledDays ? me.disabledDays.join('') : false,
            ddaysText = me.disabledDaysText,
            format = me.format,
            days = eDate.getDaysInMonth(date),
            firstOfMonth = eDate.getFirstDateOfMonth(date),
            startingPos = firstOfMonth.getDay() - me.startDay,
            previousMonth = eDate.add(date, eDate.MONTH, -1),
            longDayFormat = me.longDayFormat,
            prevStart,
            current,
            disableToday,
            tempDate,
            setCellClass,
            html,
            cls,
            formatValue,
            selected = me.values,
            value;

        if (startingPos < 0) {
            startingPos += 7;
        }

        days += startingPos;
        prevStart = eDate.getDaysInMonth(previousMonth) - startingPos;
        current = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), prevStart, me.initHour);

        setCellClass = function(cell){
            value = +eDate.clearTime(current, true);
            cell.title = eDate.format(current, longDayFormat);
            // store dateValue number as an expando
            cell.firstChild.dateValue = value;
            var day = current.getDate();



            // disabling
            if(value < min) {
                cell.className = disabledCls;
                cell.title = me.minText;
                return;
            }
            if(value > max) {
                cell.className = disabledCls;
                cell.title = me.maxText;
                return;
            }
            if(me.enabledDay && me.enabledDay!==new Date(value).getDay()){
                cell.className = disabledCls;
                cell.title = 'bad day';
                return;
            }



            if(ddays){
                if(ddays.indexOf(current.getDay()) != -1){
                    cell.title = ddaysText;
                    cell.className = disabledCls;
                }
            }
            if (ddMatch && format){
                formatValue = eDate.dateFormat(current, format);
                if (ddMatch.test(formatValue)){
                    cell.title = ddText.replace('%0', formatValue);
                    cell.className = disabledCls;
                }
            }

            selected.forEach( function( sel ) {
                if ( day == sel && cell.className == me.activeCls ){
                    cell.className += ' ' + me.selectedCls;
                    me.fireEvent('highlightitem', me, cell);
                    if (visible && me.floating) {
                        Ext.fly( cell.firstChild ).focus(50);
                    }
                    return;
                }
            });

        };

        for(; i < me.numDays; ++i) {
            var cell = cells[i];
            if (i < startingPos) {
                html = (++prevStart);
                cls = me.prevCls;
            } else if (i >= days) {
                html = (++extraDays);
                cls = me.nextCls;
            } else {
                html = i - startingPos + 1;
                cls = me.activeCls;
            }
            textNodes[i].innerHTML = html;
            current.setDate(current.getDate() + 1);

            cell.className = cls;
            setCellClass(cell);
        }

        me.monthBtn.setText(Ext.Date.format(date, me.monthYearFormat));
    },

    getMyDays: function () {

    }
});