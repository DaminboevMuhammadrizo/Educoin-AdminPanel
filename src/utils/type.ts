enum language {
    UZ = 'UZ'
}

type translations = {
    id: string,
    title: string,
    language: language
}

type Category = {
    id: string;
    icon: string;
    isActive: boolean;
    translations: translations[];
    createdAt: string;
};
