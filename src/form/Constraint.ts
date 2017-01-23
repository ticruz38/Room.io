export function nonEmpty() {
    return function test(value: string) {
        if(value === undefined) return {isValid: false, error: ''};
        if( value.length === 0) {
            return {
                isValid: false, 
                error: 'please input a value in that field'
            };
        }
        return {isValid: true, error: ''};
    }
}

export function atLeast(least: number) {
    return function test(value: string) {
        if(value === undefined) return {isValid: false, error: ''};
        if(value.length < least) {
            return {
                isValid: false, 
                error: 'That field require at least '+ least + ' characters'
            };
        }
        return {isValid: true, error: ''};
    }
}

export function atMost(most: number) {
    return function test(value: string) {
        if(value === undefined) return {isValid: false, error: ''};
        if(value.length > most) {
            return {
                isValid: false, 
                error: 'That field cannot be more than '+ most + 'characters'
            };
        }
        return {isValid: true, error: ''};
    }
}

export function email() {
    return function test(value: string) { 
        if(value === undefined) return {isValid: false, error: ''};
        const re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
        if( !re.test(value) ) return {
            isValid: false, 
            error: 'That email address is invalid'
        };
        return {isValid: true, error: ''};
    }
}