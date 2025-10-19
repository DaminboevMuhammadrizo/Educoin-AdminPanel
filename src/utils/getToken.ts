
export function getaccessToken(): string | null {

    const token = localStorage.getItem('accessToken');
    return token ? token : null;
}
