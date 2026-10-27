export default function ApplicationLogo({
    className = '',
    ...props
}) {
    return (
        <img
            src="/images/chimulia-color.png"
            alt="Logo CHIMULIA"
            className={`h-60 w-auto object-contain ${className}`}
            {...props}
        />
    );
}
