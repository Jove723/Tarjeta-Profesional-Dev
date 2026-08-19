import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'linkButton',
  schema: {
    // @label Objetivo (opcional): entidad con collider. Por defecto, esta misma entidad
    button: ecs.eid,
    url: ecs.string,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const objetivo = schemaAttribute.get(eid).button || eid

    const abrirEnlace = () => {
      const {url} = schemaAttribute.get(eid)
      if (!url) return

      window.open(url, '_blank', 'noopener,noreferrer')
    }

    ecs.defineState('default')
      .initial()
      .listen(objetivo, ecs.input.SCREEN_TOUCH_START, abrirEnlace)
  },
})