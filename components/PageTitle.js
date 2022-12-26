import Head from "next/head"

const PageTitle = ({title}) => {
    return (<Head>
    <title>{title}</title>
    <link rel="icon" href="/small_logo.png" />
</Head>)
}

export default PageTitle