import { Box, Button } from '@chakra-ui/react'
import { useLoginMutation } from '../generated/graphql'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { Formik, Form } from 'formik'
import React from 'react'
import { toErrorMap } from '../utils/newErrorMap'
import { useRouter } from 'next/router'

interface LoginProps {

}


export const Login: React.FC<LoginProps> = ({}) => {
    const [,login] = useLoginMutation()
    const router = useRouter()
     
    return (
        <Wrapper variant='small'>
        <Formik 
            initialValues={{username:'',password:''}} 
            onSubmit={ async (values, {setErrors})=>{
                console.log(values);
                const response = await login({options: values})
                if (response.data?.login.errors) {
                    setErrors(toErrorMap(response.data.login.errors))
                } else if (response.data?.login.user) {
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

export default Login