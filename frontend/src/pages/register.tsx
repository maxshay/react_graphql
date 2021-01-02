import { Box, Button } from '@chakra-ui/react'
import { useRegisterMutation } from '../generated/graphql'
import { InputField } from '../components/InputField'
import { toErrorMap } from '../utils/newErrorMap'
import { Wrapper } from '../components/Wrapper'
import { useRouter } from 'next/router'
import { Formik, Form } from 'formik'
import React from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'

interface RegisterProps {

}


export const Register: React.FC<RegisterProps> = ({}) => {
    const [,register] = useRegisterMutation()
    const router = useRouter()
     
    return (
        <Wrapper variant='small'>
        <Formik 
            initialValues={{username:'',password:''}} 
            onSubmit={ async (values, {setErrors})=>{
                console.log(values);
                const response = await register(values)
                if (response.data?.register.errors) {
                    setErrors(toErrorMap(response.data.register.errors))
                } else if (response.data?.register.user) {
                    // worked
                    router.push('/')
                }
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <InputField name='username' label='Username' placeholder='username' />
                    <Box mt={4}>
                        <InputField name='password' label='Password' placeholder='password' type='password' />
                    </Box>
                    <Button mt={4} type='submit' colorScheme="teal" isLoading={isSubmitting}>Login</Button>
                </Form>
            )}
        </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(Register)