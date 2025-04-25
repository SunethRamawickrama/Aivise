"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

interface Props {
  feedback: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FeedbackDrawer({ feedback, open, setOpen }: Props) {
  const feedbackPoints = feedback.split("\n\n").filter((p) => p.trim() !== "");

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 flex justify-end" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-500"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-500"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel className="h-full w-[400px] bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex justify-between items-start">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                AI Feedback
              </Dialog.Title>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {feedbackPoints.map((point, idx) => (
                <div key={idx} className="p-3 bg-gray-100 rounded-md text-sm text-gray-800">
                  {point}
                </div>
              ))}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
