import hash from './hash';
export function serialize(key) {
    var args = null;
    if (typeof key === 'function') {
        try {
            key = key();
        }
        catch (err) {
            // dependencies not ready
            key = '';
        }
    }
    if (Array.isArray(key)) {
        // args array
        args = key;
        key = hash(key);
    }
    else {
        // convert falsy values to ''
        key = String(key || '');
    }
    var errorKey = key ? 'err@' + key : '';
    var isValidatingKey = key ? 'req@' + key : '';
    return [key, args, errorKey, isValidatingKey];
}
