import MaskedInput from "react-text-mask";
import { Field, ErrorMessage } from "formik";
import styled from "styled-components";

const GroupSC = styled.div`
    display:flex;
    flex-direction: column;
    margin-bottom: 0.5rem;

    [data="label"]{
        padding: 0.4rem;
        label{
            font-family:${({ theme }) => theme.font.family.bold};
            font-size: 1.4em;
        }
    }

    [data="input"]{
        border: 0.1rem solid #a6a6a6;
        box-shadow: 0 0.1rem 0 rgb(0 0 0 / 7%) inset;
        border-radius: 0.2rem;
        border-color:${({ error }) => error && "#d00"};
        box-shadow:${({ error }) => error && "0 0 0 0.2rem rgb(221 0 0 / 15%) inset;"};
        input{
            width: 100%;
            background-color: transparent;
            padding: 0.8rem;
            padding-top: 0.9rem;
            box-shadow: none;
            border: 0;
            font-size: 1.1rem;
            &:disabled{
            cursor: default;
            background: #d3d3d3;
            }
            &::placeholder{
                font-size: 0.9rem;
                color: #d3d3d3;
            }
            }
        [data="show-password"]{
            width: 100%;
            padding: 0 10px 6px 10px;
            span{
            color: #555!important;
            font-size: 0.9rem !important;
            }
        }
    }

    [data="error"]{
        font-size: 1rem;
        color: #e72626;
        margin-top: 0.0rem;
        small{
            padding: 0px;
            margin: 0px;
        }
    }
`;

export const Group = ({ name, label, type = "text", autocomplete = "off", maxLength = 255, mask = false, error = false, size = "md", placeholder, disabled }) => {
    return (
        <GroupSC error={error} size={size}>
            <div data="label">
                <label htmlFor={name}>{label}</label>
            </div>
            <div data="input">
                {!mask && (
                    <Field name={name}>
                        {({ field }) => (
                            <input
                                {...field}
                                id={name}
                                type={type}
                                maxLength={maxLength}
                                autoComplete={autocomplete}
                                placeholder={placeholder}
                                disabled={disabled}
                                value={field.value || ''}
                            />
                        )}
                    </Field>
                )}
                {!!mask && (
                    <Field name={name}>
                        {({ field }) => (
                            <MaskedInput
                                {...field}
                                id={name}
                                type={type}
                                maxLength={maxLength}
                                autoComplete={autocomplete}
                                mask={mask}
                                guide={false}
                                showMask={false}
                                placeholder={placeholder}
                                disabled={disabled}
                                value={field.value || ''}
                            />
                        )}
                    </Field>
                )}
            </div>
            <div data="error">
                <small>
                    <ErrorMessage name={name} />
                </small>
            </div>
        </GroupSC>
    );
};

export const GroupSelect = ({ name, label, data = [],
    sm, md, lg = 6, xl = 4, xxl = 3 }) => {
    const propsGroup = {
        sm,
        md,
        lg,
        xl,
        xxl,
    };
    return (
        <GroupSC {...propsGroup}>
            <label htmlFor={name}>{label}</label>
            <Field children name={name}>
                {({ field }) => (
                    <select
                        {...field}
                        id={name}
                        name={name}
                        value={field.value || ''}
                    >
                        {data.map((item, key) => {
                            return <option key={key} value={item.value}>{item.name}</option>
                        })}
                    </select>
                )}
            </Field>
            <small>
                <ErrorMessage name={name} />
            </small>
        </GroupSC>
    );
};