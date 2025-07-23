interface DeleteChatsModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
  }
  
  export default function DeleteChatsModal({
    open,
    onClose,
    onConfirm,
  }: DeleteChatsModalProps) {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-xs md:max-w-sm w-full text-center">
          <h2 className="text-lg md:text-xl font-bold text-[#F7717D] mb-4">
            Delete Chat?
          </h2>
          <p className="mb-6 text-[#7F2982] text-sm md:text-base">
            Are you sure you want to delete this chat? This cannot be undone.
          </p>
          <div className="flex justify-center gap-2 md:gap-4">
            <button
              onClick={onClose}
              className="px-3 md:px-4 py-2 rounded-lg bg-gray-200 text-[#7F2982] font-semibold hover:bg-gray-300 transition text-xs md:text-base"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await onConfirm();
                onClose();
              }}
              className="px-3 md:px-4 py-2 rounded-lg bg-[#F7717D] text-white font-semibold hover:bg-[#DE639A] transition text-xs md:text-base"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
  