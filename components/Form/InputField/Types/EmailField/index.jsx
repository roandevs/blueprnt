import React from 'react';
import {
    Form
} from 'react-bootstrap';

import GeneralInputField from '@/components/Form/InputField/Types/GeneralInputField';
import {validateEmail} from '@/utils/validator';

export default class EmailField extends GeneralInputField{
    constructor(props){
        super(props);

        this.formControlRef = React.createRef();
    }

    validate(){
        if(!this.state.value){
            return {
                success: false,
                message: 'You must enter an email address'
            };
        }
        else if(!validateEmail(this.state.value)){
            return {
                success: false,
                message: 'You must enter a valid email address (must be less than 320 characters and formatted correctly I.e. example@gmail.com)'
            };
        }
        return {
            success: true,
        };
    }
    
    render(){
        return (
            <>
                <Form.Label>{this.props.fieldName}</Form.Label>
                <Form.Control ref={this.formControlRef} value={this.state.value} onChange={this.updateField.bind(this)} type="email" placeholder={this.props.fieldName} />
            </>
        )
    }
}