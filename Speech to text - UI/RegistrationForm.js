import React from 'react'
import { Grid, Paper, Button, Typography } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Select from 'react-select'

const options = [
    { value: 'Course 1', label: 'Course 1' },
    { value: 'Course 2', label: 'Course 2' },
    { value: 'Course 3', label: 'Course 3' }
]



const RegistrationForm = () => {
    const paperStyle = { padding: '0 15px 40px 15px', width: 250, }
    const btnStyle = { marginTop: 10 }
    const phoneRegExp=/^[2-9]{2}[0-9]{8}/
    const passwordRegExp=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    const initialValues = {
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword:''
    }
    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3, "It's too short").required("Required"),
        email: Yup.string().email("Enter valid email").required("Required"),
        // phoneNumber: Yup.number().typeError("Enter valid Phone number").required("Required"),
        phoneNumber:Yup.string().matches(phoneRegExp,"Enter valid Phone number").required("Required"),
        password: Yup.string().min(8, "Minimum characters should be 8")
            .matches(passwordRegExp,"Password must have one upper, lower case, number, special symbol").required('Required'),
        confirmPassword:Yup.string().oneOf([Yup.ref('password')],"Password not matches").required('Required')
    })
    const onSubmit = (values, props) => {

        alert(JSON.stringify(values), null, 2)
        props.resetForm()
    }
    return (
        <Grid>
            <Paper elevation={0} style={paperStyle}>
                <Grid align='center'>
                    <Typography variant='caption'>Fill the form to update your repository and notify your students</Typography>
                </Grid>
                <br/>
                <Select options={options} />
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form noValidate>
                            <Field as={TextField} name='description' label='Description' fullWidth/>
                            <br/><br/><br/>
                            <Select options={options} />
                            <Field as={TextField} name='message' label='Message For Students' fullWidth/>

                            <Button type='submit' style={btnStyle} variant='contained'
                                    color='primary'>Send</Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Grid>
    )
}

export default RegistrationForm;
