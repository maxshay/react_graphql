import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import { useRegisterMutation } from '../generated/graphql'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { Formik, Form } from 'formik'
import React from 'react'
import { toErrorMap } from '../utils/newErrorMap'
import { useRouter } from 'next/router'
import { route } from 'next/dist/next-server/server/router'

interface registerProps {

}


export const Register: React.FC<registerProps> = ({}) => {
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

export default Register