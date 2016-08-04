/**
 * Created by smile on 29/07/16.
 */



$( function() {
    $.widget( "custom.combobox", {
        _create: function() {
            this._onchange = this.element.closest("select").prop("onchange");
            this.wrapper = $( "<span>" )
                .addClass( "custom-combobox" )
                .insertAfter( this.element );

            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },

        /*_renderItem: function( ul, item ) {
            return $( "<li>" )
                .attr( "data-value", item.value )
                .append( item.label )
                .appendTo( ul );
        },*/

        setValueTo: function (value) {
            this.element.val(value);

            var selected = this.element.children(":selected"),
                value = selected.val() ? selected.text() : "";
            this.input.val(value);
        },

        _createAutocomplete: function() {
            var selected = this.element.children( ":selected" ),
                value = selected.val() ? selected.text() : "",
                element_id = this.element.attr("id");

            this.input = $( "<input>" )
                .appendTo( this.wrapper )
                .val( value )
                .attr( "title", "" )
                .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
                .autocomplete({
                    delay: 0,
                    minLength: 0,
                    source: $.proxy( this, "_source" ),
                    create: function() {
                        $(this).data('ui-autocomplete')._renderItem  = function (ul, item) {


                            if (element_id === "countryId") {
                                return $("<li>")
                                    .attr("data-value", item.value)
                                    .append("<img src='images/flags/" + item.val.toLowerCase() + ".png'> " + item.label)
                                    .appendTo(ul);
                            }
                            else
                            {
                                return $("<li>")
                                    .attr("data-value", item.label)
                                    .append(item.label)
                                    .appendTo(ul);
                            }

                        };

                    },
                    select: function( event, ui ) {

                        if (element_id === "countryId") {

                            $(this).css("background-image", "url(images/flags/" + ui.item.val.toLowerCase() + ".png)");
                            $(this).css("background-position", "7px 7px");
                            $(this).css("background-repeat", "no-repeat");
                            $(this).css("padding-left", "30px");

                        }

                    }
                })
                .tooltip({
                    classes: {
                        "ui-tooltip": "ui-state-highlight"
                    }
                });

            this._on( this.input, {
                autocompleteselect: function( event, ui ) {
                    ui.item.option.selected = true;
                    this._trigger( "select", event, {
                        item: ui.item.option
                    });

                    if(this._onchange)
                        this._onchange();

                },

                autocompletechange: "_removeIfInvalid"
            });
        },

        _createShowAllButton: function() {
            var input = this.input,
                wasOpen = false;

            $( "<a>" )
                .attr( "tabIndex", -1 )
                //.attr( "title", "Show All Items" )
                .attr( "role", "button" )
                .tooltip()
                .appendTo( this.wrapper )
                /*.button({
                 icons: {
                 primary: "ui-icon-triangle-1-s"
                 },
                 text: false
                 })*/
                .append('<span class="ui-button-icon-primary ui-icon ui-icon-triangle-1-s"></span><span class="ui-button-text"></span>')
                .removeClass( "ui-corner-all" )
                //.addClass( "custom-combobox-toggle ui-corner-right" )
                .addClass( "ui-button ui-widget ui-state-default ui-button-icon-only custom-combobox-toggle ui-corner-right" )
                .on( "mousedown", function() {
                    wasOpen = input.autocomplete( "widget" ).is( ":visible" );
                })
                .on( "click", function() {
                    input.trigger( "focus" );

                    // Close if already visible
                    if ( wasOpen ) {
                        return;
                    }

                    // Pass empty string as value to search for, displaying all results
                    input.autocomplete( "search", "" );
                });
        },

        _source: function( request, response ) {
            var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" ),
                element_id = this.element.attr("id");;
            response( this.element.children( "option" ).map(function() {
                var text = $( this ).text();
                var val = $( this ).val();
                if ( this.value && ( !request.term || matcher.test(text) ) )
                    return {
                        label: text,
                        // DOESN'T WORK ! value: (element_id === "countryId") ? ("<img src='images/flags/" + val.toLowerCase() + ".png'> " + text) : text,
                        value: text,
                        val: val,
                        option: this
                    };
            }) );
        },

        _removeIfInvalid: function( event, ui ) {

            // Selected an item, nothing to do
            if ( ui.item ) {
                return;
            }

            // Search for a match (case-insensitive)
            var value = this.input.val(),
                valueLowerCase = value.toLowerCase(),
                valid = false;
            this.element.children( "option" ).each(function() {
                if ( $( this ).text().toLowerCase() === valueLowerCase ) {
                    this.selected = valid = true;
                    return false;
                }
            });

            // Found a match, nothing to do
            if ( valid ) {
                return;
            }

            // Remove invalid value
            this.input
                .val( "" )
                .attr( "title", value + " didn't match any item" )
                .tooltip( "open" );
            this.element.val( "" );
            this._delay(function() {
                this.input.tooltip( "close" ).attr( "title", "" );
            }, 2500 );
            this.input.autocomplete( "instance" ).term = "";
        },

        _destroy: function() {
            this.wrapper.remove();
            this.element.show();
        }
    });

} );