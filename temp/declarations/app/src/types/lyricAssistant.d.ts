export interface Message {
    id: number;
    type: 'ai' | 'user';
    content: string;
    timestamp: string;
    avatar: string;
    status?: '在线' | '离线';
    lyrics?: {
        title: string;
        sections: Array<{
            type: string;
            content: string;
        }>;
    };
    analysis?: {
        title: string;
        points: string[];
    };
}
export interface Theme {
    id: number;
    title: string;
    description: string;
    icon: string;
    iconCode: string;
}
export interface QuickPhrase {
    id: number;
    text: string;
}
export type UserStatus = '在线' | '离线' | '忙碌';
export interface Tip {
    id: number;
    title: string;
    content: string;
    icon: string;
    color: string;
    points: string[];
}
export interface InputState {
    value: string;
    placeholder: string;
    focused: boolean;
}
