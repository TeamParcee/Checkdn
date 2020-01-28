import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController, PopoverController, ModalController, ActionSheetController } from '@ionic/angular';
import { AlertInput } from '@ionic/core';
import { componentFactoryName } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
  ) { }


  loading;
  showLoading() {

    this.loading = this.loadingCtrl.create().then((loading) => {
      loading.present()
    })
  }
  hideLoading() {
    this.loadingCtrl.dismiss(this.loading)
  }
  openModal(component, componentProps) {
    this.modalCtrl.create({
      component: component,
      componentProps: componentProps
    }).then((modal) => {
      modal.present();
    })
  }

  openModalPromise(component, componentProps) {

    return new Promise((resolve) => {
      return this.modalCtrl.create({
        component: component,
        componentProps: componentProps
      }).then((modal) => {
        modal.present()
        modal.onDidDismiss().then((result) => {
        return resolve(result.data);
        })
      })
    })
  }

  openModalSetId(component, componentProps, id) {

    return new Promise((resolve) => {
      return this.modalCtrl.create({
        component: component,
        componentProps: componentProps
      }).then((modal) => {
        modal.present().then(()=>{
          modal.id = id
        })
        modal.onDidDismiss().then(() => {
        return resolve();
        })
      })
    })
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }
  closeModalWithId(id){
  this.modalCtrl.dismiss(id);    
  }
  okAlert(header: string, message: string) {
    this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ["OK"]
    }).then((alert) => {
      alert.present();
    })
  }

  stopTimerAlert(activity) {
    return new Promise((resolve) => {
      this.alertCtrl.create({
        header: "Activity Ended",
        message: activity.name + " has ended",
        buttons: [{
          text: "OK",
          role: "cancel",
          handler: () => {
            return resolve(true)
          }
        }]
      }).then((alert) => {
        alert.present();
      })
    })

  }
  confirmationAlert(header: string, message: string, buttons: { denyText: string, confirmText: string }) {

    return new Promise((resolve) => {
      this.alertCtrl.create({
        header: header,
        message: message,
        buttons: [
          {
            text: buttons.denyText,
            handler: () => {
              return resolve(false)
            }
          }, {
            text: buttons.confirmText,
            handler: () => {
              return resolve(true)
            }
          }
        ]
      }).then((alert) => {
        alert.present();
      })
    })

  }

  generateid() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  inputAlert(header: string, message: string, inputs: AlertInput[]) {
    return new Promise(async (resolve) => {
      let alert = await this.alertCtrl.create({
        header: header,
        message: message,
        inputs: inputs,
        buttons: [
          {
            text: "Cancel",
            role: 'cancel'
          }, {
            text: "Save",
            handler: (result) => {
              return resolve(result)
            }
          }
        ]
      })
      alert.present()
    })


  }

  presentPopover(ev: Event, component, componentProps) {

    return new Promise((resolve) => {
      return this.popoverCtrl.create({
        component: component,
        event: ev,
        translucent: true,
        componentProps: componentProps,
      }).then((popover) => {
        popover.present();
        popover.onDidDismiss().then((result) => {
          return resolve(result);
        })
      })
    })

  }
  closePopover() {
    this.popoverCtrl.dismiss();
  }
  closePopoverWithData(data) {
    this.popoverCtrl.dismiss(data)
  }
  getPopoverData() {
  }
  showToast(message) {
    this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: "bottom",
    }).then((toast) => {
      toast.present();
    })
  }

  
}