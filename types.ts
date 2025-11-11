

export enum SocialPlatform {
    TWITTER = 'Twitter',
    LINKEDIN = 'LinkedIn',
    DRIBBBLE = 'Dribbble',
    INSTAGRAM = 'Instagram',
    FACEBOOK = 'Facebook',
    THREADS = 'Threads',
    YOUTUBE = 'YouTube',
    TIKTOK = 'TikTok',
    PINTEREST = 'Pinterest',
}

export interface Post {
    id: string;
    userId: string;
    caption: string;
    platforms: SocialPlatform[];
    tags: string[];
    mediaUrls: string[];
    scheduledAt: string; // Stored as ISO string in state
    status: 'scheduled' | 'published' | 'failed' | 'draft';
    autoCommenting?: boolean;
}

export interface Persona {
    id?: string;
    userId: string;
    name: string;
    characteristics: string;
    avoid: string;
}