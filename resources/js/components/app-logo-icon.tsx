import Logo from '@/assets/logo-nobg.png';

export default function AppLogoIcon() {
    return (
        <div className="w-32 h-32">
            <img
                src={Logo}
                alt="Travel With Me Logo"
                className="w-full h-full object-contain"
            />
        </div>
    );
}
