export enum language {
    UZ = 'UZ'
}

export type translations = {
    id: string,
    title: string,
    language: language
}

export type Category = {
    id: string;
    icon: string;
    isActive: boolean;
    translations: translations[];
    createdAt: string;
};
