import { Box, Button, Flex, Link } from '@chakra-ui/react'
import { useMeQuery } from '../generated/graphql'
import NextLink from 'next/link'
import React from 'react'

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
   const [{data, fetching}] = useMeQuery()
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
            <Button variant='link'>Logout</Button>
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