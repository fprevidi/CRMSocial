import {
    Dialog,
    DialogContent,
    DialogTitle,

} from './ui/dialog'; // Ensure the path is correct
type DialogType = 'sino' | 'cancel';

interface WarningDialogProps {
    title: string;
    content: string;
    type: DialogType;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm?: () => void; // Callback for the "Yes" button
    onCancel?: () => void;  // Callback for the "No" or "Cancel" button
}

const WarningDialog: React.FC<WarningDialogProps> = ({ title, content, type, isOpen, onOpenChange, onConfirm,
    onCancel }) => {
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onOpenChange(false);
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        onOpenChange(false);
    };

    return (
          <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>
                    {title}
                </DialogTitle>
                {content} 
                 {type === 'sino' ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 w-1/2 mx-auto">
                            <button onClick={handleConfirm} className="btn-conferma">S&igrave;</button>
                            <button onClick={handleCancel} className="btn-delete">No</button>
                        </div>
                   </>
                        ) : (
                        <button onClick={handleCancel}>OK</button>
                            
                        )}
            </DialogContent>
        </Dialog>

        
    );
};

export default WarningDialog;
