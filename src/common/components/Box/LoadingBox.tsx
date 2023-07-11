import * as React from "react";
import { memo } from "react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { Modal } from "office-ui-fabric-react/lib/Modal";
interface ILoadingBoxProps {
  isOpen: boolean;
  infoDetails: string;
}

export default memo(function LoadingBox(props: ILoadingBoxProps) {
  const { isOpen, infoDetails } = props;
  return (
    <Modal
      containerClassName={"modal-container"}
      isOpen={isOpen}
      isBlocking={true}
    >
      <div
        className="ms-Dialog-header"
        style={{
          fontSize: "20px",
          fontWeight: 600,
          color: "rgb(50,49,48",
          margin: 0,
          minHeight: "20px",
          padding: "16px 46px 20px 24px",
          lineHeight: "normal",
        }}
      >
        Please wait ...{" "}
      </div>
      <div>
        <Spinner
          size={SpinnerSize.large}
          label={infoDetails}
          ariaLive="assertive"
        />
      </div>
    </Modal>
  );
});
