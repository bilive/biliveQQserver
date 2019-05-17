import { Options as requestOptions } from 'request'
import Plugin, { tools } from '../../plugin'

class serverQQ extends Plugin {
  constructor() {
    super()
  }
  public name = 'QQ Server提醒'
  public description = '发送消息到指定QQ'
  public version = '0.0.1'
  public author = '稻草'
  /**
   * 获取设置
   *
   * @private
   * @type {options}
   * @memberof serverQQ
   */
   // 基于lzghzr方糖插件二次修改
  private _!: options
  public async load({ defaultOptions, whiteList }: {
    defaultOptions: options,
    whiteList: Set<string>
  }): Promise<void> {
    // 管理员QQ提醒
    defaultOptions.config['adminserverQQ'] = ''
    defaultOptions.info['adminserverQQ'] = {
      description: 'QQSKEY',
      tip: 'QQ提醒的SCKEY, 将信息发送到此账号',
      type: 'string'
    }
    whiteList.add('adminserverQQ')
    // 用户QQ提醒
    defaultOptions.newUserData['serverQQ'] = ''
    defaultOptions.info['serverQQ'] = {
      description: 'SCKEY',
      tip: 'QQ提醒的SCKEY, 将信息发送到此账号',
      type: 'string'
    }
    whiteList.add('serverQQ')
    this.loaded = true
  }
  public async options({ options }: { options: options }): Promise<void> {
    this._ = options
    tools.on('systemMSG', data => this._onSystem(data))
    tools.on('SCMSG', data => this._SCMSG(data))
    tools.sendSCMSG = (message: string) => {
      const adminserverQQ = <string>this._.config['adminserverQQ']
      if (adminserverQQ !== '') this._send(adminserverQQ, message)
    }
  }
  /**
   * 处理systemMSG
   *
   * @private
   * @param {systemMSG} data
   * @memberof serverQQ
   */
  private _onSystem(data: systemMSG) {
    const adminserverQQ = <string>data.options.config['adminserverQQ']
    if (adminserverQQ !== '') this._send(adminserverQQ, data.message)
    if (data.user !== undefined) {
      const userserverQQ = <string>data.user.userData['serverQQ']
      if (userserverQQ !== '') this._send(userserverQQ, data.message)
    }
  }
  /**
   * 处理SCMSG
   *
   * @private
   * @param {({ serverQQ: string | undefined, message: string })} { serverQQ, message }
   * @memberof serverQQ
   */
  private _SCMSG({ serverQQ, message }: { serverQQ: string | undefined, message: string }) {
    const server = serverQQ || <string>this._.config['adminserverQQ']
    if (server !== '') this._send(server, message)
  }
  /**
   * 发送QQ提醒消息
   *
   * @private
   * @param {string} serverQQ
   * @param {string} message
   * @memberof serverQQ
   */
   // 也没什么改动，为了方便Server用户改动，所以并无大变化
  private _send(serverQQ: string, message: string) {
    const send: requestOptions = {
      method: 'POST',
      uri: `http://bilive.dcaoao.com/botpost.php`,
      body: `key=${serverQQ}&content=${message}`,
      json: true
    }
    tools.XHR<serverQQ>(send)
  }
}

/**
 * QQ提醒
 *
 * @interface serverQQ
 */
interface serverQQ {
  errno: number
  errmsg: string
  dataset: string
}

export default new serverQQ()