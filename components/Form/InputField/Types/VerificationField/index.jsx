import React from 'react';
import {
    Form
} from 'react-bootstrap';

import GeneralInputField from '@/components/Form/InputField/Types/GeneralInputField';
import styles from '../../InputField.module.css';

export default class VerificationField extends GeneralInputField{
    constructor(props){
        super(props);

        this.formControlRef = React.createRef();
    }

    validate(){
        if(!this.state.value){
            return {
                success: false,
                message: 'You must enter the verification code that was sent via email'
            };
        }
        return {
            success: true
        };
    }
    
    render(){
        return (
            <>
                <Form.Label id={styles['form-label']}>{this.props.fieldName}</Form.Label>
                <Form.Control id={styles['form-input']} ref={this.formControlRef} value={this.state.value} onChange={this.updateField.bind(this)} type="text"  />
            </>
        )
    }
}