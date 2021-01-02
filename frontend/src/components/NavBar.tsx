import { Box, Button, Flex, Link } from '@chakra-ui/react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import NextLink from 'next/link'
import React from 'react'
import { isServer } from '../utils/isServer'

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{fetching: logoutFetching}, logout] = useLogoutMutation()
    const [{data, fetching}] = useMeQuery({
        pause: isServer()
    })
    let body = null

    if (fetching) {
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link color="white" mr={2}>login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="white">register</Link>
                </NextLink>
            </>
        )
    } else {
        body = (
        <Flex>
            <Box mr={2}>{data.me.username}</Box>
            <Button onClick={() => logout()} variant='link' loading={logoutFetching}>Logout</Button>
        </Flex> 
        )
    }

    return (

        <Flex bg="tomato" p={4}>
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    )
}

export default NavBar