import React, { useState, FC } from 'react';
import style from './SurveyCard.module.scss';
import { ISurveyInfo } from '../../types/survey';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useActions } from '../../hooks/useActions';
import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { removeSurvey } from '../../helper';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

interface ISurveyCardProps {
    surveyInfo: ISurveyInfo;
    cssProperties?: React.CSSProperties;
}

const SurveyCard: FC<ISurveyCardProps> = ({ surveyInfo, cssProperties }) => {
    const navigate = useNavigate();
    const { removeSurveyCard } = useActions();

    const [showAlertRemoveDialog, setShowAlertRemoveDialog] = useState<boolean>(false);
    const openAlertRemoveDialog = () => setShowAlertRemoveDialog(true);
    const closeAlertRemoveDialog = () => setShowAlertRemoveDialog(false);

    const renderAlertRemoveDialog = () => (
        <Dialog
            open={showAlertRemoveDialog}
            onClose={closeAlertRemoveDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {`Delete the ${surveyInfo.isEvaluated ? 'test' : 'survey'} ${surveyInfo.title}?`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    After deleting this {surveyInfo.isEvaluated ? 'test' : 'survey'}, you will not be able to restore it.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeAlertRemoveDialog}> Disagree </Button>
                <Button onClick={confirmRemove} autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    )

    const confirmRemove = () => {
        removeSurvey(surveyInfo.id);
        removeSurveyCard(surveyInfo.id);
        closeAlertRemoveDialog()
    }

    return (
        <div className={style.SurveyCard} style={cssProperties}>
            {showAlertRemoveDialog && renderAlertRemoveDialog()}

            <IconButton 
                className = {style.DeleteIcon}
                aria-label="delete" 
                onClick={openAlertRemoveDialog}
            >
                <DeleteIcon />
            </IconButton>

            <IconButton 
                className = {style.EditIcon}
                onClick={() => navigate(`/survey-constructor/${surveyInfo.id}`)}
                aria-label="edit"
            >
                <EditIcon />
            </IconButton>

            <img
                src={surveyInfo.imageUrl}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = process.env.REACT_APP_DEFAULT_SURVEY_IMAGE_URL
                        || 'https://fpprt.ru/wp-content/uploads/2021/02/file.jpg';
                }}
                alt={"SurveyCard"}
                className={style.Image}
            />
            <div className={style.TitleDescription}>
                <Typography
                    variant={"h5"}
                    component={"h5"}
                    sx={{ marginBottom: '20px' }}
                >
                    {surveyInfo.title}
                </Typography>
                <Typography
                    variant={"body1"}
                    component={"p"}
                >
                    {surveyInfo.description}
                </Typography>
            </div>
            <Button
                variant='contained'
                onClick={() => navigate(`/survey/${surveyInfo.id}`)}
                fullWidth
                sx={{
                    padding: '10px',
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                    borderTopLeftRadius: '0px',
                    borderTopRightRadius: '0px'
                }}
            >
                {surveyInfo.isEvaluated ? 'Take the quiz' : 'Take the survey'}
            </Button>
        </div>
    );
}

export default SurveyCard;