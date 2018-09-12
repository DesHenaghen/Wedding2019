export class ModalService {
  private modals: any[] = [];

  add(modal: any) {
    // add modal to array of active modals
    console.log("adding modal to stack"+ modal);
    this.modals.push(modal);
  }

  remove(id: string) {
    // remove modal from array of active modals
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string) {
    console.log('opening '+ id);
    // open modal specified by id
    let modal: any = this.modals.filter(x => x.id === id)[0];
    console.log('found modal');
    modal.open();
  }

  close(id: string) {
    // close modal specified by id
    let modal: any = this.modals.filter(x => x.id === id)[0];
    modal.close();
  }
}
