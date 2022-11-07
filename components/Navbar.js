import Image from "next/image"

const Navbar = () => {
    return (
        <nav>
            <div className="logo">
                <Image alt="hip hop logo" priority src="/logo.png" width={300} height={300}/>
            </div>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/page2">Ninja listing</a>
        </nav>
    )
}

export default Navbar