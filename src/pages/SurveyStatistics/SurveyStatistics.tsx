import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Typography, CircularProgress } from '@mui/material';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Header from '../../components/Header/Header';
import style from './SurveyStatistics.module.scss';

const SurveyResultsTable: FC = () => {
    const [showAlertRemoveDialog, setShowAlertRemoveDialog] = useState<boolean>(false);
    const [removedResultsId, setRemovedResultsId] = useState<string>('');
    const surveyId = useParams().id;
    const navigate = useNavigate();
    const { loadSurveyStatistics, deleteSurveyResults } = useActions();
    const { loading, error, surveyStatistics } = useTypedSelector(state => state.survey);

    useEffect(() => {
        if (surveyId) {
            loadSurveyStatistics(surveyId);
        } else {
            navigate('/');
        }
    }, [])

    const openAlertRemoveDialog = () => setShowAlertRemoveDialog(true);
    const closeAlertRemoveDialog = () => setShowAlertRemoveDialog(false);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 200, align: 'center', headerAlign: 'center' },
        { field: 'user', headerName: 'User', width: 200, align: 'center', headerAlign: 'center' },
        { field: 'completionDate', headerName: 'Completion date', width: 180, align: 'center', headerAlign: 'center' },
        { field: 'passingTime', headerName: 'Passing time', width: 180, align: 'center', headerAlign: 'center' },
        { field: 'earnedScore', headerName: 'Earned score', width: 180, align: 'center', headerAlign: 'center' },
        { field: 'correctAnswersRate', headerName: 'Correct answers rate (%)', width: 250, align: 'center', headerAlign: 'center' },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label='Delete answers'
                        onClick={() => deleteIconClickHandler(String(id))}
                        color='inherit'
                    />,
                    <GridActionsCellItem
                        icon={<VisibilityIcon />}
                        label='View answers'
                        onClick={() => navigate(`/survey-results/${String(id)}`)}
                        color='inherit'
                    />
                ];
            }
        }
    ];

    const renderRows = () => {
        return (
            surveyStatistics.map(item => {
                return {
                    id: item.id,
                    user: item.user?.displayName,
                    completionDate: item.completionDate,
                    passingTime: item.passingTime,
                    earnedScore: item.earnedScore,
                    correctAnswersRate: item.correctAnswersRate
                }
            })
        );
    }

    const deleteIconClickHandler = (id: string) => {
        setRemovedResultsId(id);
        openAlertRemoveDialog();
    }

    const renderAlertRemoveDialog = (id: string) => (
        <Dialog
            open={showAlertRemoveDialog}
            onClose={closeAlertRemoveDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {`Delete the survey answers ${id}?`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    After deleting this answers, you will not be able to restore it.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeAlertRemoveDialog}> Disagree </Button>
                <Button onClick={async () => { await confirmRemove(id) }} autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    )

    const confirmRemove = async (id: string) => {
        deleteSurveyResults(id);
        closeAlertRemoveDialog();
    }

    if (loading) {
        return (
            <>
                <Header />
                <div className={style.Loading}>
                    <CircularProgress />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className={style.Error}>
                    <Typography
                        variant={"h1"}
                        component={"h1"}
                    >
                        {error}
                    </Typography>
                </div>
            </>
        );
    }

    return (
        <>

            <Header />
            <div
                className={style.SurveyResultsTable}
            >
                {showAlertRemoveDialog && renderAlertRemoveDialog(removedResultsId)}
                {
                    <DataGrid
                        autoHeight
                        rows={renderRows()}
                        columns={columns}
                        disableRowSelectionOnClick
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        className={style.Table}
                    />
                }

            </div>
        </>
    );
}

export default SurveyResultsTable;