import { useRef } from "react";

interface ConfirmModalProps {
  title: string;
  message?: string;
  confirmText?: string;
  confirmClassName?: string;
  loading?: boolean;
  onConfirm: () => Promise<void> | void;
  trigger: React.ReactNode; 
}

export const ConfirmModal = ({
  title,
  message,
  confirmText = "Confirm",
  confirmClassName = "btn btn-error",
  loading = false,
  onConfirm,
  trigger,
}: ConfirmModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => modalRef.current?.showModal();
  const closeModal = () => modalRef.current?.close();

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm();
    closeModal();
  };

  return (
    <>
      <span onClick={openModal} className="inline-block">
        {trigger}
      </span>

      <dialog ref={modalRef} className="modal">
        <form method="dialog" className="modal-box" onSubmit={handleConfirm}>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
            disabled={loading}
          >
            ✕
          </button>

          <div className="mb-5">
            <h3 className="font-bold text-lg">{title}</h3>
            {message && <p>{message}</p>}
          </div>

          <button
            className={`${confirmClassName} w-full`}
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              confirmText
            )}
          </button>
        </form>
      </dialog>
    </>
  );
};
