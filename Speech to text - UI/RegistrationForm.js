import React from 'react'
import { Grid, Paper, Button, Typography } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import Select from 'react-select'
import axios from "axios";

const options = [
    { value: 'Course 1', label: 'Course 1' },
    { value: 'Course 2', label: 'Course 2' },
    { value: 'Course 3', label: 'Course 3' }
]



const RegistrationForm = () => {
    const paperStyle = { padding: '0 15px 40px 15px', width: 250, }
    const btnStyle = { marginTop: 10 }
    let select_values = {'course_name' : null, 'group_name' : null}
    const initialValues = {
        description: '',
        message: '',
    }

    const send = (values) => {
        console.log("send RegistrationForm to server!")
        axios
            .post('http://localhost:5000/update_repository', values)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.warn(err));
    };

    const onSubmit = (values, props) => {
        let data = Object.assign({}, values, select_values)
        console.log(data)
        send(data)
        props.resetForm()
    }

    const courseHandleChange = selectedOption => {
        //this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
        select_values['course_name'] = selectedOption
    };

    const groupHandleChange = selectedOption => {
        //this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
        select_values['group_name'] = selectedOption
    };

    return (
        <Grid>
            <Paper elevation={0} style={paperStyle}>
                <Grid align='center'>
                    <Typography variant='caption'>Fill the form to update your repository and notify your learning partners
                    </Typography>
                </Grid>
                <br/>
                <Select onChange={courseHandleChange} options={options} />
                <Formik initialValues={initialValues} onSubmit={onSubmit}>
                    {(props) => (
                        <Form noValidate>
                            <Field as={TextField} name='description' label='Description for course unit' fullWidth/>
                            <br/><br/><br/>
                            <Select onChange={groupHandleChange} options={options} />
                            <Field as={TextField} name='message' label='Message For Learning group' fullWidth/>

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
