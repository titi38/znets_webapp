/**
 * Created by smile on 23/08/16.
 */


/**
 * Rivets Formatter Function
 * Add prefix (prependString) to value
 * @param value
 * @param prependString
 * @returns {string|*}
 */
rivets.formatters.prepend = function(value, prependString) {
    return prependString + value
}
