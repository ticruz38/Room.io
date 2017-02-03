declare type Field = {
    value: any;
    constraints: Function[];
    isValid: boolean;
}

declare type ObjectLitteral = {[prop: string]: string}