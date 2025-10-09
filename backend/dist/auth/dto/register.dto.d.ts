export declare class RegisterDto {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    password: string;
    referralCode?: string;
    birthDate: string;
    gender: 'masculin' | 'féminin';
    acceptedTerms: boolean;
}
