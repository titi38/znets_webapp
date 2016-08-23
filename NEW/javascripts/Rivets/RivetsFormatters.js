/**
 * Created by smile on 23/08/16.
 */


/**
 * Rivets Formatter Function
 * Add prefix (prepend) to value
 * @param value
 * @param prependString
 * @returns {*}
 */
rivets.formatters.prepend = function(value, prependString) {
    return prependString + value
}