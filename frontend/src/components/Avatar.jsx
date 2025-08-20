

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


function Avatar({ src, alt, className }) {
    const imgSrc = src ? `${BACKEND_URL}${src}` : "/default-avatar.png";
    return <img src={imgSrc} alt={alt} className={className} />;
}
export default Avatar;