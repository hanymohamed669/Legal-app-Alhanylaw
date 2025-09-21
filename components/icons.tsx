import React from 'react';

type IconProps = {
    className?: string;
};

export const DashboardIcon: React.FC<IconProps> = ({ className }) => ( // Courthouse Icon
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.25L3.335 9.336a1.5 1.5 0 00-.835 1.331V21a1.5 1.5 0 001.5 1.5h16a1.5 1.5 0 001.5-1.5V10.667a1.5 1.5 0 00-.835-1.331L12 2.25zM15 21h-2.25v-6H15V21zm-5.25 0H7.5v-6h2.25V21zm6-9h-1.5v-1.5h1.5V12zm-3.75 0h-1.5v-1.5h1.5V12zm-3.75 0H6v-1.5h2.25V12z" />
    </svg>
);
export const CaseIcon: React.FC<IconProps> = ({ className }) => ( // Scale of Justice
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M14.625 1.501a1.5 1.5 0 00-1.843.987l-2.5 6.25a1.5 1.5 0 00-1.258 1.258l-6.25 2.5a1.5 1.5 0 000 2.83l6.25 2.5a1.5 1.5 0 001.258 1.258l2.5 6.25a1.5 1.5 0 002.83 0l2.5-6.25a1.5 1.5 0 001.258-1.258l6.25-2.5a1.5 1.5 0 000-2.83l-6.25-2.5a1.5 1.5 0 00-1.258-1.258l-2.5-6.25a1.5 1.5 0 00-.987-1.843zM13.5 6.068l1.628 4.07a3 3 0 012.516 2.516l4.07 1.628-4.07 1.628a3 3 0 01-2.516 2.516L13.5 22.298l-1.628-4.07a3 3 0 01-2.516-2.516L5.286 14.07l4.07-1.628a3 3 0 012.516-2.516L13.5 6.068z" clipRule="evenodd" />
    </svg>
);
export const SessionIcon: React.FC<IconProps> = ({ className }) => ( // Gavel Icon (for sessions)
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.375 2.25a1.5 1.5 0 00-2.063.29l-6.75 8.25a1.5 1.5 0 00.916 2.493h2.324v2.033a1.5 1.5 0 00.187.755l3.188 5.313a1.5 1.5 0 002.625 0l3.188-5.313a1.5 1.5 0 00.187-.755v-2.033h2.324a1.5 1.5 0 00.916-2.493l-6.75-8.25a1.5 1.5 0 00-1.296-1.042z" />
    </svg>
);
export const CalendarIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.25 2.25A2.25 2.25 0 003 4.5v15A2.25 2.25 0 005.25 21.75h13.5A2.25 2.25 0 0021 19.5v-15A2.25 2.25 0 0018.75 2.25H5.25zm.75 3a.75.75 0 00-.75.75v10.5a.75.75 0 00.75.75h12a.75.75 0 00.75-.75V6a.75.75 0 00-.75-.75H6zm8.25 2.25a.75.75 0 100 1.5h-4.5a.75.75 0 100-1.5h4.5z" clipRule="evenodd" />
    </svg>
);
export const DocumentIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M5.625 3.75a2.25 2.25 0 012.25-2.25h8.25a2.25 2.25 0 012.25 2.25v16.5a2.25 2.25 0 01-2.25 2.25H7.875a2.25 2.25 0 01-2.25-2.25V3.75zM9 7.5a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zM9 11.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zM9 15a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H9z" />
    </svg>
);
export const TaskIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-12a3 3 0 013-3H6V3a.75.75 0 01.75-.75zM18.75 9H5.25v10.5c0 .414.336.75.75.75h12c.414 0 .75-.336.75-.75V9zm-5.78 6.97a.75.75 0 001.06-1.06l-2.25-2.25a.75.75 0 00-1.06 0l-1.5 1.5a.75.75 0 101.06 1.06L12 14.56l.97.97z" clipRule="evenodd" />
    </svg>
);
export const TeamIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.25 4.5a4.125 4.125 0 100 8.25 4.125 4.125 0 000-8.25zM11.25 14.25a8.625 8.625 0 00-8.527 7.042.75.75 0 00.741.858h15.572a.75.75 0 00.741-.858A8.625 8.625 0 0011.25 14.25zM17.25 8.25a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM19.5 8.25a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5z" />
    </svg>
);
export const UsersIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM4.5 16.125a9.375 9.375 0 019.375-9.375h.008a9.375 9.375 0 019.375 9.375v.219a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-.219z" />
    </svg>
);
export const LogoutIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M15.75 2.25a.75.75 0 01.75.75v5.25h.75a3 3 0 013 3v6a3 3 0 01-3 3H8.25a3 3 0 01-3-3v-6a3 3 0 013-3h.75V3a.75.75 0 01.75-.75h6zM17.25 9H8.25a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5v-6a1.5 1.5 0 00-1.5-1.5zM12 2.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);
export const GavelIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.375 2.25a1.5 1.5 0 00-2.063.29l-6.75 8.25a1.5 1.5 0 00.916 2.493h2.324v2.033a1.5 1.5 0 00.187.755l3.188 5.313a1.5 1.5 0 002.625 0l3.188-5.313a1.5 1.5 0 00.187-.755v-2.033h2.324a1.5 1.5 0 00.916-2.493l-6.75-8.25a1.5 1.5 0 00-1.296-1.042z" />
    </svg>
);
export const MapPinIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.16-4.242 16.975 16.975 0 00-5.16-17.545S11.96 1.5 11.54 1.5zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);
export const ExternalLinkIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 10.5a.75.75 0 01.75-.75h3.75a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V11.56l-6.22 6.22a.75.75 0 11-1.06-1.06l6.22-6.22H13.5a.75.75 0 010-1.5z" />
        <path d="M4.5 4.5a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 011.5 0v4.5a4.5 4.5 0 01-4.5 4.5H4.5a4.5 4.5 0 01-4.5-4.5V7.5a4.5 4.5 0 014.5-4.5h4.5a.75.75 0 010 1.5H4.5z" />
    </svg>
);
export const SearchIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
);
export const PlusIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);
export const ChevronDownIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
    </svg>
);
export const PdfIcon: React.FC<IconProps> = ({ className }) => ( // A generic file icon for simplicity
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M5.625 3.75a2.25 2.25 0 012.25-2.25h8.25a2.25 2.25 0 012.25 2.25v16.5a2.25 2.25 0 01-2.25 2.25H7.875a2.25 2.25 0 01-2.25-2.25V3.75z" />
    </svg>
);
export const WordIcon: React.FC<IconProps> = ({ className }) => ( // A generic file icon for simplicity
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M5.625 3.75a2.25 2.25 0 012.25-2.25h8.25a2.25 2.25 0 012.25 2.25v16.5a2.25 2.25 0 01-2.25 2.25H7.875a2.25 2.25 0 01-2.25-2.25V3.75z" />
    </svg>
);
export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.943 1.543A12.013 12.013 0 005.93 6.942a12.016 12.016 0 00-3.322 3.322c-.663.244-1.543.926-1.543 1.943v.001c0 .917.663 1.699 1.543 1.943a12.013 12.013 0 003.322 3.322 12.016 12.016 0 006.942 2.188c.244.663.926 1.543 1.943 1.543h.001c.917 0 1.699-.663 1.943-1.543a12.013 12.013 0 006.942-2.188 12.016 12.016 0 003.322-3.322c.663-.244 1.543-.926 1.543-1.943v-.001c0-.917-.663-1.699-1.543-1.943a12.013 12.013 0 00-3.322-3.322A12.016 12.016 0 0013.02 3.793c-.244-.663-.926-1.543-1.943-1.543h-.001zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
    </svg>
);
export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
        <path d="M3.75 18.75a3 3 0 003 3h10.5a3 3 0 003-3v-2.25a.75.75 0 00-1.5 0v2.25a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5V18.75z" />
    </svg>
);
export const FilePlusIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M5.625 3.75a2.25 2.25 0 012.25-2.25h8.25a2.25 2.25 0 012.25 2.25v16.5a2.25 2.25 0 01-2.25 2.25H7.875a2.25 2.25 0 01-2.25-2.25V3.75z" />
        <path d="M12 10.5a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5a.75.75 0 01.75-.75z" />
    </svg>
);
export const BellIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-2.43 0-4.63.74-6.49 2.033a.75.75 0 00-.51 1.054l1.363 4.295A3.743 3.743 0 015.25 12h13.5c.414 0 .807-.084 1.18-.242l1.364-4.295a.75.75 0 00-.51-1.054A13.43 13.43 0 0012 2.25zM4.02 14.25a.75.75 0 01.75-.75h14.46a.75.75 0 01.75.75c0 .093-.01.185-.03.275l-1.35 4.05a1.5 1.5 0 01-1.42 1.175H6.07a1.5 1.5 0 01-1.42-1.175l-1.35-4.05a.75.75 0 01-.278-.275zM12 22.5a.75.75 0 00.75-.75v-1.5a.75.75 0 00-1.5 0v1.5a.75.75 0 00.75.75z" clipRule="evenodd" />
    </svg>
);
export const ClockIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
    </svg>
);
export const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M16.5 4.5a3.75 3.75 0 10-7.5 0h7.5z" clipRule="evenodd" />
        <path d="M5.25 6.375a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75z" />
        <path fillRule="evenodd" d="M17.806 8.246a.75.75 0 01.67.733l-.75 10.5a3 3 0 01-3 2.771H9.274a3 3 0 01-3-2.771l-.75-10.5a.75.75 0 01.67-.733h12.312z" clipRule="evenodd" />
    </svg>
);
export const ArchiveIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 3A1.5 1.5 0 00.75 4.5v3A1.5 1.5 0 002.25 9h19.5A1.5 1.5 0 0023.25 7.5v-3A1.5 1.5 0 0021.75 3H2.25zm13.5 9A1.5 1.5 0 0014.25 10.5h-4.5A1.5 1.5 0 008.25 12v3A1.5 1.5 0 009.75 16.5h4.5A1.5 1.5 0 0015.75 15v-3zm-6 0v3h4.5v-3h-4.5z" clipRule="evenodd" />
        <path d="M2.25 10.5a1.5 1.5 0 00-1.5 1.5v3A1.5 1.5 0 002.25 16.5h19.5A1.5 1.5 0 0023.25 15v-3a1.5 1.5 0 00-1.5-1.5H2.25z" />
    </svg>
);
export const EditIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a.75.75 0 00-.22.53v2.532a.75.75 0 00.75.75H8.199a.75.75 0 00.53-.22l12.15-12.15z" />
    </svg>
);
