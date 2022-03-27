import React from 'react'
import { Grid, Paper, Button, Typography } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import Select from 'react-select'

const options = [
    { value: 'Course 1', label: 'Course 1' },
    { value: 'Course 2', label: 'Course 2' },
    { value: 'Course 3', label: 'Course 3' }
]



const RegistrationForm = () => {
    const paperStyle = { padding: '0 15px 40px 15px', width: 250, }
    const btnStyle = { marginTop: 10 }

    const initialValues = {
        description: '',
        message: '',
    }

    const onSubmit = (values, props) => {
        console.log(values)
        // alert(JSON.stringify(values), null, 2)
        props.resetForm()
    }

    const handleChange = selectedOption => {
        //this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    };


    let selectedOption = '';
    return (
        <Grid>
            <Paper elevation={0} style={paperStyle}>
                <Grid align='center'>
                    <Typography variant='caption'>Fill the form to update your repository and notify your students</Typography>
                </Grid>
                <br/>
                <Select value={selectedOption} onChange={handleChange} options={options} />
                <Formik initialValues={initialValues} onSubmit={onSubmit}>
                    {(props) => (
                        <Form noValidate>
                            <Field as={TextField} name='description' label='Description' fullWidth/>
                            <br/><br/><br/>
                            <Select value={selectedOption} onChange={handleChange} options={options} />
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
