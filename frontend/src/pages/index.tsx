import { createUrqlClient } from '../utils/createUrqlClient'
import { withUrqlClient } from 'next-urql'
import NavBar from '../components/NavBar'
import { usePostsQuery } from '../generated/graphql'

const Index = () => { 

    const [{data}] = usePostsQuery()

    return (
        <>
            <NavBar />
            <div>hello world</div> 
            <br />
            <h2>Posts</h2>
            {!data ? <div>Loading</div> : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
        </>
    )
}


export default withUrqlClient(createUrqlClient, { ssr: true })(Index)

