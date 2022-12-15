import Link from "next/link"
import { useRouter } from "next/router"

const StyledLink = ({href, label}) => {
    const router = useRouter()

    return (
        <Link shallow style={{
            textDecoration: (router.pathname === href) ? 'underline' : 'none',
            padding: '0.5rem'
        }} className="is-active" href={href}>{label}</Link>
    )
}

export default StyledLink