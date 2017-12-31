class ConvenienceStores {
  private static _convenience_stores = new window.SObjectModel.convenience_stores__c()

  public static Gets({ where_ }: { where_?}) {
    return new Promise(async (Resolve_: (_: any[]) => void, Reject_: (_) => void) => {

      try {
        let rs = []
        let offset = 1
        while (true) {
          if (offset > 2000) {
            break
          }

          const cs = await this.Retrieve({ offset_: offset, where_ })
          rs = rs.concat(cs)
          if (cs.length === 100) {
            offset += 100
            continue
          }

          break
        }

        Resolve_(rs)
      } catch (_) {
        Reject_(_)
      }

    }).catch(_ => { throw _ })
  }

  private static Retrieve({ offset_, where_ }: { offset_: number, where_ }) {
    return new Promise((Resolve_: (_) => void, Reject_: (_) => void) => {

      const c = { limit: 100, offset: offset_, where: where_ }
      if (where_ != null) {
        c.where = where_
      }

      this._convenience_stores.retrieve(c, (error_, records_: any[]) => {
        if (error_ != null) {
          Reject_(error_)
          return
        }

        Resolve_(records_)
      })

    }).catch(_ => { throw _ })
  }
}

export default { ConvenienceStores }
