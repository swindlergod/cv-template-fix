import React from 'react';
import { useCallback, useState } from 'react';

import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { DevTool } from '@hookform/devtools';
import classes from './CvTemplate.module.scss';

import { DemoCvModal } from '../../components/organisms/DemoCvModal';
import { CvTemplatePDF } from '../CvTemplatePDF';
import { buttonStyle } from '../../assets/style/buttonStyle';

import { Box } from '@mui/material';
import PersonalInfo from '../../components/organisms/PersonalInfo';
import Education from '../../components/organisms/Education';
import Experience from '../../components/organisms/Experience';
import Social from '../../components/organisms/Social';
import Hobbies from '../../components/organisms/Hobbies';
import PersonalPhoto from '../../components/organisms/PersonalPhoto';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useDispatch } from 'react-redux';

import { addAllPersonalInfo } from '../../store/cvTemplate/allPersonaInfoSlice';
import { yupResolver } from '@hookform/resolvers/yup';

const validationSchema = yup.object().shape({
  fullName: yup.string().required('Is a required field').min(3).max(20),
  position: yup.string().required('Is a required field').min(3).max(20),
  address: yup.string().required('Is a required field').min(3).max(20),
  website: yup.string().required('Is a required field').url().nullable(),
  phone: yup
    .number()
    .typeError('Amount must be a number')
    .required('Please provide plan cost.')
    .min(0, 'Too little'),
  email: yup.string().required('Is a required field').email(),
  bio: yup.string().required('Is a required field'),

  educationData: yup
    .array()
    .of(
      yup.object().shape({
        study: yup.string().required('Is a required field'),
        degree: yup.string().required('Is a required field'),
        school: yup.string().required('Is a required field'),
        educationFromYear: yup.date().required('Is a required field'),
        'education-to-year': yup.date().required('Is a required field'),
      }),
    )
    .required(),

  experienceData: yup
    .array()
    .of(
      yup.object().shape({
        'work-title': yup.string().required('Is a required field'),
        company: yup.string().required('Is a required field'),
        'experience-from-year': yup.string().required('Is a required field'),
        'experience-to-year': yup.string().required('Is a required field'),
        'company-info': yup.string().required('Is a required field'),
      }),
    )
    .required(),

  socialData: yup.array().of(
    yup.object().shape({
      'social-name': yup.string().required('Is a required field'),
      'social-link': yup.string().required('Is a required field'),
    }),
  ),

  hobbyData: yup.array().of(
    yup.object().shape({
      label: yup.string().required('Is a required field'),
    }),
  ),
});

interface IFormInputs extends yup.InferType<typeof validationSchema> {}

const stepTitle = (title: string) => {
  return <Typography variant="h5">{title}</Typography>;
};

const stepContent = (element: JSX.Element) => {
  return element;
};

const CvTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const methods = useForm<IFormInputs>({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      fullName: '',
      position: '',
      address: '',
      bio: '',
      email: '',
      phone: undefined,
      website: '',

      educationData: [
        {
          study: '',
          degree: '',
          school: '',
          educationFromYear: undefined,
          'education-to-year': undefined,
        },
      ],

      experienceData: [
        {
          'work-title': '',
          company: '',
          'experience-from-year': '',
          'experience-to-year': '',
          'company-info': '',
        },
      ],

      hobbyData: [
        {
          label: '',
        },
      ],
      socialData: [
        {
          'social-name': '',
          'social-link': '',
        },
      ],
    },
  });

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = async () => {
    let isValid: boolean = false;

    switch (activeStep) {
      case 0:
        isValid = await methods.trigger([
          'fullName',
          'position',
          'address',
          'website',
          'phone',
          'email',
          'bio',
        ]);
        break;

      case 1:
        isValid = await methods.trigger('educationData');
        break;

      case 2:
        isValid = await methods.trigger('experienceData');
        break;

      case 3:
        isValid = await methods.trigger('socialData');
        break;

      case 4:
        isValid = await methods.trigger(['hobbyData']);
        break;

      case 5:
        isValid = true;
        break;
    }

    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const steps = [
    {
      id: 1,
      label: stepTitle('Personal Info'),
      form: stepContent(<PersonalInfo />),
      state: 'active',
    },
    {
      id: 2,
      label: stepTitle('Education'),
      form: stepContent(<Education />),
      state: '',
    },
    {
      id: 3,
      label: stepTitle('Experience'),
      form: stepContent(<Experience />),
      state: '',
    },
    {
      id: 4,
      label: stepTitle('Social'),
      form: stepContent(<Social />),
      state: '',
    },
    {
      id: 5,
      label: stepTitle('Hobbies'),
      form: stepContent(<Hobbies />),
      state: '',
    },
    {
      id: 6,
      label: stepTitle('Photo'),
      form: stepContent(<PersonalPhoto />),
      state: '',
    },
  ];

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    const transformedData = {
      personalData: {
        fullName: data.fullName,
        address: data.address,
        bio: data.bio,
        position: data.position,
        phone: data.phone,
        website: data.website,
        email: data.email,
      },

      educationData: data.educationData.map((education) => ({
        description: education.study,
        position: education.degree,
        fromYear: new Date(education.educationFromYear).getFullYear(),
        toYear: new Date(education['education-to-year']).getFullYear(),
        name: education.school,
      })),

      experienceData: data.experienceData.map((experience) => ({
        position: experience['work-title'],
        fromYear: new Date(experience['experience-from-year']).getFullYear(),
        toYear: new Date(experience['experience-to-year']).getFullYear(),
        name: experience.company,
        description: experience['company-info'],
      })),

      socialData: data.socialData?.map((social) => ({
        link: social['social-link'],
        name: social['social-name'],
      })),

      hobbyData: data.hobbyData?.map((hobby) => ({
        hobby: hobby.label,
      })),
    };

    console.log('TRANSFORMED DATA', transformedData);
    dispatch(addAllPersonalInfo(transformedData));
    handleNext();
  };

  const getButtonStatus = (index: number) => {
    if (index === activeStep) {
      steps[index].state = 'active';
      return 'active';
    } else if (index < activeStep) {
      steps[index].state = 'done';
      return 'done';
    } else {
      steps[index].state = 'next';
      return 'next';
    }
  };

  const getButtonStyles = (index: number) => {
    const buttonStatus = getButtonStatus(index);

    return {
      color:
        buttonStatus === 'active'
          ? '#462174'
          : buttonStatus === 'done'
          ? 'white'
          : buttonStatus === 'next'
          ? '#4E4D4D'
          : 'initial',
      backgroundColor:
        buttonStatus === 'active'
          ? 'white'
          : buttonStatus === 'done'
          ? '#462174'
          : buttonStatus === 'next'
          ? '#dddbdb'
          : 'initial',
      border:
        buttonStatus === 'active'
          ? '2px solid #462174'
          : buttonStatus === 'done'
          ? '#462174'
          : buttonStatus === 'next'
          ? '2px solid #4E4D4D'
          : 'initial',
    };
  };

  return (
    <Box className={classes.cvTemlpate}>
      <Box className={classes.cvTemlpate__header}>
        <Typography variant="h3">Resumo Resume Builder</Typography>
      </Box>
      <Box className={classes.cvTemlpate__container}>
        <Box className={classes.cvTemlpate__content}>
          <Box className={classes.cvTemlpate__rightWrapper}>
            <Box className={classes.cvTemlpate__right}>
              <FormProvider {...methods}>
                <Box className={classes.cvTemlpate__stepper}>
                  <Box className={classes.cvTemlpate__step}>
                    {steps.map((step, index) => (
                      <Button
                        disabled={true}
                        variant="contained"
                        style={getButtonStyles(index)}
                        sx={{
                          mt: 1,
                          mr: 1,
                          margin: '15px',
                          width: '322px',
                          height: '70px',
                        }}
                        key={step.id}
                      >
                        {step.label}
                      </Button>
                    ))}
                  </Box>
                  {activeStep === steps.length && (
                    <Paper
                      square
                      elevation={0}
                      sx={{ p: 3, boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)' }}
                      className={classes.cvTemlpate__stepContent}
                    >
                      <Typography variant="h4">
                        All steps completed - you&apos;re finished
                      </Typography>

                      <>
                        <Button onClick={onToggleModal} sx={buttonStyle}>
                          Preview
                        </Button>
                        <DemoCvModal
                          content={<CvTemplatePDF />}
                          isOpen={isOpen}
                          onClose={onToggleModal}
                        />
                        <Button onClick={handleReset} sx={buttonStyle}>
                          AT FIRST
                        </Button>
                      </>
                    </Paper>
                  )}
                  {steps.map((step) => {
                    if (step.state === 'active') {
                      return (
                        <Box
                          component="form"
                          className={classes.cvTemlpate__stepContent}
                          key={step.id}
                        >
                          <Typography
                            variant="caption"
                            className={classes.cvTemlpate__stepContentLabel}
                          >
                            {step.label}
                          </Typography>
                          {step.form}

                          <Box className={classes.cvTemlpate__stepContentButton}>
                            <Button
                              disabled={step.id === 1}
                              onClick={handleBack}
                              sx={{ mt: 1, mr: 1 }}
                            ></Button>

                            <Button
                              onClick={step.id === 6 ? methods.handleSubmit(onSubmit) : handleNext}
                              variant="contained"
                              sx={buttonStyle}
                            >
                              {step.id === 6 ? 'Finish' : 'Next session'}
                            </Button>
                          </Box>
                        </Box>
                      );
                    } else {
                      return null;
                    }
                  })}
                </Box>
                <DevTool control={methods.control} placement="top-left" />
              </FormProvider>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CvTemplate;
