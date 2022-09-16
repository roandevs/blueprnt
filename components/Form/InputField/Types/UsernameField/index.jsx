import React from 'react';
import {
    Form
} from 'react-bootstrap';

import GeneralInputField from '@/components/Form/InputField/Types/GeneralInputField';
import {validateUsername} from '@/utils/validator';

export default class UsernameField extends GeneralInputField{
    constructor(props){
        super(props);

        this.formControlRef = React.createRef();
    }

    validate(){
        if(!this.state.value){
            return {
                success: false,
                message: 'You must enter a username'
            };
        }
        else if(!validateUsername(this.state.value)){
            return {
                success: false,
                message: 'You must enter a valid username (must be between 2-30 characters of length)'
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
                <Form.Control ref={this.formControlRef} value={this.state.value} onChange={this.updateField.bind(this)} type="text" placeholder="Username" />
            </>
        )
    }
}